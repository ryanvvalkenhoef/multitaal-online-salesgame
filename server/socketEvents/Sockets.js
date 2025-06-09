import getMovesFromCoordinate from '../utils/positionCalculator.js';
import SocketManager from '../socket/SocketManager.js';
import PlayerQuestionQueue from '../questionQueue/PlayerQuestionQueue.js';
import ModQuestionQueue from '../questionQueue/ModQuestionQueue.js';
import RoomGenerator from '../utils/RoomGenerator.js';
import GameSetupManager from '../GameLogic/GameSetupManager.js';
import UserLogger from '../logging/UserLogger.js';
import ModLogger from '../logging/ModLogger.js';
import JsonFileHandler from '../utils/jsonFileHandler.js';
import instanceFactory from '../utils/instanceFactory.js';
import ReconnectionManager from '../GameLogic/ReconnectionManager.js';
import { modulePopUp, getTranslatedQuestion } from '../database/DatabaseManager.js';

export default function (io) {
  const playerQuestionQueue = new PlayerQuestionQueue();
  const modQuestionQueue = new ModQuestionQueue();

  io.on("connection", (socket) => {
    const socketManager = new SocketManager(io);
    /** @type {GameManager} */
    let gameManager;
    /** @type {ModLogger} */
    let modLogger;
    /** @type {GameStateTracker} */
    let gameStateTracker;
    /** @type {UserLogger} */
    let userLogger;
    /** @type {JsonFileHandler} */
    let jsonFileHandler;
    /**@type {GameScreenDataEmitter}*/
    let gameScreenDataEmitter;

    const socketHandlers = {
      //create_room is the entry point for the moderator
      //data is an object consisting of playercount and roundscount.
      create_room: (data) => {
        const room = RoomGenerator.createRoom();
        const instances = instanceFactory(
          room,
          socketManager,
          modQuestionQueue,
        );
        jsonFileHandler = instances.jsonFileHandler;
        modLogger = instances.modLogger;
        userLogger = instances.userLogger;
        gameStateTracker = instances.gameStateTracker;
        gameManager = instances.gameManager;
        gameScreenDataEmitter = instances.gameScreenDataEmitter;

        jsonFileHandler.createJsonFile();

        modLogger.create(socket.id, data);

        GameSetupManager.setTotalPlayers(data.playerCount, jsonFileHandler);
        GameSetupManager.setTotalRounds(data.roundsCount, jsonFileHandler);

        socket.emit("send_gamepin", {
          room: room,
          playerTotal: data.playerCount,
        });
        socket.room = room; // adds room code as property to socket object
        socket.join(`${room}mod`);
        socket.join(room);
      },

      disconnect: () => {
        //niet zeker of dit werkt, moeilijk te testen
        socket.emit("go_to_home_screen");
      },

      join_room: (data) => {
        //join_room is the entry point for the players
        let room;
        let joinStatus;

        const existingRooms = RoomGenerator.getRoomList();
        const isValidRoom = GameSetupManager.checkIfValidRoom(
          data.room,
          existingRooms,
        );
        jsonFileHandler = new JsonFileHandler(data.room);
        const isRoomFull = GameSetupManager.checkIfRoomFull(jsonFileHandler);
        const isStrategyAssigned = data.strategy !== "";
        const isStrategyUnique = GameSetupManager.checkIfUniqueStrategy(
          jsonFileHandler,
          data.strategy,
        );
        const isNameUnique = GameSetupManager.checkIfUniqueName(
          jsonFileHandler,
          data.name,
        );

        if (
          isValidRoom &&
          !isRoomFull &&
          isStrategyAssigned &&
          isStrategyUnique &&
          isNameUnique
        ) {
          // All info is valid so player can join the game.
          //adds socket to rooms and adds room code as property to socket object
          socket.join(data.room);
          socket.join(`${data.room}players`);
          socket.room = data.room;
          room = data.room;

          const instances = instanceFactory(
            room,
            socketManager,
            modQuestionQueue,
          );
          jsonFileHandler = instances.jsonFileHandler;
          modLogger = instances.modLogger;
          userLogger = instances.userLogger;
          gameStateTracker = instances.gameStateTracker;
          gameManager = instances.gameManager;
          gameScreenDataEmitter = instances.gameScreenDataEmitter;

          //user is being created and values assigned to properties of user object
          console.log(JSON.stringify(userLogger));
          userLogger.create(socket.id);
          userLogger.update(socket.id, { name: data.name });
          userLogger.update(socket.id, { room: room });
          userLogger.update(socket.id, { strategy: data.strategy });
          const playerColor = GameSetupManager.getColor(
            socket.id,
            jsonFileHandler,
          );
          userLogger.update(socket.id, { color: playerColor });

          //Updates the gameState object in the json file
          GameSetupManager.addStrategy(
            data.strategy.toLowerCase(),
            jsonFileHandler,
          );
          GameSetupManager.addPlayerName(data.name, jsonFileHandler);

          console.log('passed');
          socketManager.emitToMod(socket, "add_user", "adding");
          joinStatus = "available";
          socketManager.emitBackToClient(socket, "join_succes", joinStatus);
          gameScreenDataEmitter.sendPiecesData(socket);
          gameScreenDataEmitter.sendPlayerColors(socket);
          //socketManager.emitBackToClient(socket,)
        } else {
          // checks if joinStatus is undefined to prevent overwriting previous assignment.
          // The conditions are checked in a specific order.
          joinStatus = !isValidRoom ? "Room does not exist" : undefined;
          joinStatus =
            !isStrategyAssigned && !joinStatus
              ? "Choose a strategy"
              : joinStatus;
          joinStatus =
            !isStrategyUnique && !joinStatus
              ? "Strategy already in use"
              : joinStatus;
          joinStatus =
            !isNameUnique && !joinStatus ? "Name already in use" : joinStatus;
          joinStatus = isRoomFull && !joinStatus ? "Room is full" : joinStatus;
          socketManager.emitBackToClient(socket, "join_succes", joinStatus);
        }
      },

      reconnect_player: (sessionData) => {
        try {
          const room = sessionData.room;
          const isValidRoom = GameSetupManager.checkIfValidRoom(
            room,
            RoomGenerator.getRoomList(),
          );

          if (!isValidRoom) {
            socketManager.emitBackToClient(socket, "go_to_home_screen");
          } else {
            socket.room = room;
            socket.join(room);
            socket.join(`${room}players`);

            const instances = instanceFactory(
              room,
              socketManager,
              modQuestionQueue,
            );
            jsonFileHandler = instances.jsonFileHandler;
            modLogger = instances.modLogger;
            userLogger = instances.userLogger;
            gameStateTracker = instances.gameStateTracker;
            gameManager = instances.gameManager;
            gameScreenDataEmitter = instances.gameScreenDataEmitter;

            const reconnectionManager = new ReconnectionManager(
              userLogger,
              modLogger,
              gameScreenDataEmitter,
              gameManager,
              socketManager,
              gameStateTracker,
            );
            reconnectionManager.reconnectPlayer(socket, sessionData);

            playerQuestionQueue.update(socket, sessionData);
            const questionQueueLength =
              playerQuestionQueue.read(socket, true);
            if (questionQueueLength > 0) {
              const questionData =
                playerQuestionQueue.read(socket, false);
              socketManager.emitBackToClient(
                socket,
                "receive_question",
                questionData,
              );
            }
          }
        } catch (exception) {
          console.log(exception);
          console.error("Can't reconnect player");
        }
      },

      reconnect_mod: (sessionData) => {
        try {
          const room = sessionData.room;
          const isValidRoom = GameSetupManager.checkIfValidRoom(
            room,
            RoomGenerator.getRoomList(),
          );
          if (!isValidRoom) {
            socketManager.emitBackToClient(socket, "go_to_home_screen");
          } else {
            socket.room = room;
            socket.join(room);
            socket.join(`${room}mod`);

            const instances = instanceFactory(
              room,
              socketManager,
              modQuestionQueue,
            );
            jsonFileHandler = instances.jsonFileHandler;
            modLogger = instances.modLogger;
            userLogger = instances.userLogger;
            gameStateTracker = instances.gameStateTracker;
            gameManager = instances.gameManager;
            gameScreenDataEmitter = instances.gameScreenDataEmitter;

            const reconnectionManager = new ReconnectionManager(
              userLogger,
              modLogger,
              gameScreenDataEmitter,
              gameManager,
              socketManager,
              gameStateTracker,
            );
            reconnectionManager.reconnectMod(socket, sessionData);

            const questionQueueLength =
              modQuestionQueue.getLength(socket);
            if (questionQueueLength > 0) {
              const question = modQuestionQueue.read(socket, false);
              gameManager.sendAnswerToModerator(socket, question);
            }
          }
        } catch (exception) {
          console.error("Can't reconnect moderator");
        }
      },

      send_question_request: async (data) => {
        try {
          if (!userLogger) {
            throw new Error("UserLogger not initialized");
          }

        const availableColors = [
            "red",
            "blue",
            "green",
            "yellow",
            "purple",
            "orange",
          ];
          const language = userLogger.getLanguage(socket.id);
          const { question, answer, questionId } = await modulePopUp(data.questionColor, language);
          let popupColor;
          if (data.questionColor === "rainbow") {
            data.questionColor = data.userColor;
            popupColor = data.userColor;
          }
          switch (data.questionColor) {
            case "chance":
              popupColor = "black1";
              break;
            case "sales":
              popupColor = "black2";
              break;
            case "megatrends":
              popupColor = "black3";
              break;
            default:
              popupColor = data.questionColor;
          }
          const questionData = {
            questionText: question,
            questionColor: popupColor,
            playerColor: data.userColor,
            answer: answer,
            questionId: questionId
          };
          if (availableColors.includes(data.questionColor)) {//is het een kleurvraag?
            const receiver = userLogger.getReceiver(data.questionColor);
            playerQuestionQueue.create(
              socket,
              receiver,
              questionData,
            );
            const playerFinishedTurn = userLogger.checkIfPlayerHasFinishedTurn(
              socket.id,
            );
            //naar wie moet de vraag? kleur van het vakje bepalende factor, niet speler zelf. receiver krijgt vraag socket.id gaat om degene die op het vakje staat
            if (receiver !== socket.id && !playerFinishedTurn) {
              //wanneer speler op ander gekleurd vakje komt, staat deze als gereviewed, anders blijft icoontje grijs en kan verwarrend zijn
              userLogger.update(socket.id, { hasBeenReviewed: true });
              socketManager.emitToMod(socket, "player_has_been_reviewed", {
                playerId: socket.id,
                hasBeenReviewed: true,
              });
            }
            const playerIsAnsweringQuestion =
              userLogger.checkIfPlayerIsAnsweringQuestion(receiver);
            if (!playerIsAnsweringQuestion) {
              //vraag in de queue als speler al bezig is met antwoorden
              socketManager.emitToSpecificSocket(
                receiver,
                "receive_question",
                questionData,
              );
              userLogger.setIsAnsweringQuestion(true, receiver);
              socketManager.emitToMod(socket, "player_is_answering", {
                playerId: receiver,
                isAnsweringQuestion: true,
              });
            }
          } else {
            // het is geen kleurvraag, maar een regenboog of zwarte kleur, die kan alleen naar speler zelf
            playerQuestionQueue.create(
              socket,
              socket.id,
              questionData,
            );
            socketManager.emitBackToClient(
              socket,
                "receive_question",
                questionData,
              );
              userLogger.setIsAnsweringQuestion(true, socket.id);
              socketManager.emitToMod(socket, "player_is_answering", {
                playerId: socket.id,
                isAnsweringQuestion: true,
              });
            }
          } catch (error) {
          console.error("Error getting question: ", error);
          socket.emit("error", { 
            message: "Failed to get question - please try again or rejoin the game",
            details: error.message 
          });
        }
      },
      request_translated_question: async (data) => {
        try {
          // get the current question from the queue
          console.log("Server received translation request: ", data);
          const language = data.language;
          const color = data.color;
          const questionId = data.questionId;
          let result;
          if (questionId) {
            result = await getTranslatedQuestion(questionId, language);
          } else {
            result = await modulePopUp(color, language);
          }
          // send back the translated question
          socketManager.emitBackToClient(socket, "receive_translated_question", {
            questionText: result.question,
            answer: result.answer,
            questionId: questionId
          });
        } catch (error) {
          console.error("Error requesting translated question", error);
          socket.emit("error", { message: "Failed to get translated question" });
        }
      },

      get_player_answer_on_click: (playerId) => {
        gameManager.checkIfQueueNotEmptyAndSendAnswer(socket, playerId);
      },

      send_answer_to_server: (questionData) => {
        try {
          //await gameManager.waitForModToFinishReview(modLogger);
          if (!modQuestionQueue) {
            throw new Error("Question queue not initialized");
          }
          // Include the original question and questionId in the data sent to moderator
          const modQuestionData = {
            ...questionData,
            originalQuestion: questionData.question,  // Store the original question
            questionId: questionData.questionId      // Make sure questionId is included
          };
          modQuestionQueue.create(socket, socket.id, modQuestionData);
          // Check if the question queue of the player who sent the question to the server contains any questions.
          if (!playerQuestionQueue) {
            throw new Error("Player question queue not initialized");
          }
          playerQuestionQueue.delete(socket);
          if (playerQuestionQueue.read(socket, true) > 0) {
            const nextQuestionData = playerQuestionQueue.getQuestionFromQueue(socket);
            socketManager.emitBackToClient(socket, "receive_question", nextQuestionData);
          } else {
            if (!userLogger) {
              console.error("UserLogger not initialized - player may need to rejoin");
              socket.emit("error", { message: "Session expired - please rejoin the game" });
              return;
            }
            userLogger.setIsAnsweringQuestion(false, socket.id);
          }
        } catch (error) {
          console.error("Error in send_answer_to_server:", error);
          socket.emit("error", { message: "Failed to process answer - please try again" });
        }
      },

      send_answer_request: async (data) => {
        const room = socket.room;
        let answerText = await databaseAnswer(data.answerColor, "answer");
        socket.to(room).emit("receive_answer", answerText);
        socket.emit("receive_answer", answerText);
      },

      change_language: (data) => {
        userLogger.update(socket.id, { language: data });
      },

      update_position: (data) => {
        socketManager.emitToRoom(socket, "update_position", data);
      },

      update_piece_positions: () => {
        gameScreenDataEmitter.sendPositionsData(socket);
      },

      pawns_request_failed: (data) => {
        // werkt nu  niet correct omdat method nu array geeft ipv een strategie
        const strategy = gameStateTracker.getStrategies();
        socketManager.emitBackToClient(socket, "players_turn", strategy);
      },

      get_player_strategy: (data) => {
        // event moet anders
        const strategy = userLogger.getStrategy(socket.id);
        const color = userLogger.getColor(socket.id);
        socketManager.emitBackToClient(socket, "register_current_player", {
          strategy: strategy,
          color: color,
        });
      },

      get_current: (data) => {
        // // werkt nu  niet correct omdat method nu array geeft ipv een strategie
        const strategy = gameStateTracker.getStrategies();
        socketManager.emitBackToClient(socket, "set_current_player", strategy);
      },

      get_player_count: () => {
        gameManager.sendPlayerCount(socket);
      },

      update_hasFinishedTurn: (hasFinishedTurn) => {
        userLogger.update(socket.id, { hasFinishedTurn: hasFinishedTurn });
        socketManager.emitToMod(socket, "player_has_finished_turn", {
          playerId: socket.id,
          hasFinishedTurn: hasFinishedTurn,
        });
      },

      update_player_position: (playerPosition) => {
        userLogger.update(socket.id, { playerPosition: playerPosition });
      },

      points_submitted_question_reviewed: (reviewData) => {
        try {
          const id = reviewData.playerId;
          if (!userLogger) {
            throw new Error("UserLogger not initialized");
          }
          if (!modLogger) {
            throw new Error("ModLogger not initialized");
          }
          if (!modQuestionQueue) {
            throw new Error("ModQuestionQueue not initialized");
          }
          if (!gameManager) {
            throw new Error("GameManager not initialized");
          }
          if (!gameStateTracker) {
            throw new Error("GameStateTracker not initialized");
          }

        const oldTotalPoints = userLogger.getPoints(id);
        const newTotalPoints = Number(oldTotalPoints) + Number(reviewData.totalPoints);

         userLogger.update(id, {
            totalPoints: newTotalPoints,
            previousPoints: oldTotalPoints,
          });

        modLogger.updateNumberOfQuestionsReviewed();
          modQuestionQueue.delete(socket, id);
          modLogger.setIsReviewingQuestion(false);
          gameManager.checkIfQueueNotEmptyAndSendAnswer(socket, id);
          const isRoundFinished = gameStateTracker.checkIfRoundIsFinished();
          if (isRoundFinished) {
            socketManager.emitToMod(socket, "is_next_round_button_disabled", false);
          }
        } catch (error) {
          console.error("Error in points_submitted_question_reviewed:", error);
          socket.emit("error", {
            message: "Failed to process points submission - the game session may need to be restarted",
            details: error.message
          });
        }
      },

      start_next_round: () => {
        // checks if the round is finished
        const isRoundFinished = gameStateTracker.checkIfRoundIsFinished();

        if (isRoundFinished) {
          modLogger.resetNumberOfQuestionsReviewed();
          userLogger.resetHasFinishedTurn();
          gameManager.updateGameState(socket);
          gameManager.startRound(socket);
          gameManager.updatePiecePositions(socket);
          socketManager.emitToMod(
            socket,
            "is_next_round_button_disabled",
            true,
          );
          socketManager.emitToMod(socket, "reset_player_progress_styles");
        } else {
          console.log("Round is not finished yet. Manual trigger ignored.");
        }
      },

      /////// Events staan tijdelijk in dit bestand
      get_tileInfo: (data) => {
        gameScreenDataEmitter.sendBoardData(socket);
      },

      roll_dice: (playerRollDice) => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        socket.emit("set_dice", diceValue);
        //try/catch tegen crashen maar onduidelijk waarom userlogger soms na tijdje niks doen undefined is
        try {
          const canRollDice = userLogger.getCanRollDice(socket.id);
          if (canRollDice && playerRollDice) {
            //if its truly players turn do this
            userLogger.setCanRollDice(socket.id, false);
            socketManager.emitToSpecificSocket(
              socket.id,
              "set_roll_dice",
              false,
            );
          }
        } catch (error) {
          console.error("Error getting canRollDice", error);
        }
      },

      send_dice_roll_and_position: (data) => {
        const coordinate = data.position.split("-");
        const xPos = parseInt(coordinate[0]);
        const yPos = parseInt(coordinate[1]);
        const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);
        let formattedPositions = moves.map((pos) => `${pos.x}-${pos.y}`);
        socket.emit("update_valid_positions", formattedPositions);
      },

      start_turn: (data) => {
        gameManager.startRound(socket);
      },

      get_pieces: (data) => {
        const pieces = gameStateTracker.getStrategies();
        gameScreenDataEmitter.sendPiecesData(socket);
        socketManager.emitToRoom(socket, "add_player_color", pieces); // moet een eigen event voor komen
      },
      link_player_to_piece: () => {
        const strategy = userLogger.getStrategy(socket.id);
        socketManager.emitBackToClient(socket, "players_turn", strategy);
      },

      get_results: () => {
        const room = socket.room;
        const users = userLogger.getScores();
        const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);

        socketManager.emitBackToClient(socket, "show_results", sortedUsers);
      },
    };
    Object.keys(socketHandlers).forEach((event) => {
      socket.on(event, socketHandlers[event]);
    });
  });
};
