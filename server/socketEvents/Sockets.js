const databaseQuestion = require("../database/database");
const databaseAnswer = require("../database/database");
const getMovesFromCoordinate = require("../positionCalculator");
const SocketManager = require("../Socket/SocketManager");
const PlayerQuestionQueue = require('../questionQueue/PlayerQuestionQueue');
const ModQuestionQueue = require("../questionQueue/ModQuestionQueue");
const RoomGenerator = require('../roomGenerator/RoomGenerator');
const PreGameManager = require('../preGameManager/PreGameManager')
const JsonFileHandler = require("../jsonFileHandler/JsonFileHandler");
const instanceFactory = require("../instanceFactory/instanceFactory");
const ReconnectionManager = require("../ReconnectionManager/ReconnectionManager");



module.exports = function (io){

    const playerQuestionQueue = new PlayerQuestionQueue();
    const modQuestionQueue = new ModQuestionQueue();


    io.on('connection', (socket) => {

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
            'create_room': (data) => {
                const room = RoomGenerator.createRoom();
                const instances = instanceFactory(room,socketManager,modQuestionQueue);
                jsonFileHandler = instances.jsonFileHandler;
                modLogger = instances.modLogger;
                userLogger = instances.userLogger;
                gameStateTracker = instances.gameStateTracker;
                gameManager = instances.gameManager;
                gameScreenDataEmitter = instances.gameScreenDataEmitter;

                jsonFileHandler.createJsonFile();

                modLogger.createMod(socket.id, data);

                PreGameManager.setTotalPlayers(data.playerCount, jsonFileHandler);
                PreGameManager.setTotalRounds(data.roundsCount, jsonFileHandler);

                socket.emit('send_gamepin', {room: room, playerTotal: data.playerCount});
                socket.room = room; // adds room code as property to socket object
                socket.join(`${room}mod`);
                socket.join(room);
            },

            'disconnect': (reason) => { // Moet later naar gekeken worden
                // const room = userLogger(room, "getRoom", socket.id)
                // const name = userLogger(room, 'getPlayerNames', socket.id)
                // modLogger(room, 'removeUser', socket.id, {name: name, room: room})
                // socket.to(userLogger(room, "getRoom", socket.id)).emit('delete_user', "deleting")
                // userLogger(room, "delete", socket.id)
                // modLogger(room, "delete", socket.id)
            },

            'join_room': (data) => { //join_room is the entry point for the players
                let room;
                let joinStatus;

                const existingRooms = RoomGenerator.getRoomList();
                const isValidRoom = PreGameManager.checkIfValidRoom(data.room, existingRooms);
                jsonFileHandler = new JsonFileHandler(data.room);
                const isRoomFull = PreGameManager.checkIfRoomFull(jsonFileHandler)
                const isStrategyAssigned = data.strategy !== '';
                const isStrategyUnique = PreGameManager.checkIfUniqueStrategy(jsonFileHandler,data.strategy);
                const isNameUnique = PreGameManager.checkIfUniqueName(jsonFileHandler,data.name);


                if (isValidRoom && isStrategyAssigned && !isRoomFull && isStrategyUnique && isNameUnique) { // All info is valid so player can join the game.
                    //adds socket to rooms and adds room code as property to socket object
                    socket.join(data.room);
                    socket.join(`${data.room}players`);
                    socket.room = data.room;
                    room = socket.room;

                    const instances = instanceFactory(room,socketManager,modQuestionQueue);
                    jsonFileHandler = instances.jsonFileHandler;
                    modLogger = instances.modLogger;
                    userLogger = instances.userLogger;
                    gameStateTracker = instances.gameStateTracker;
                    gameManager = instances. gameManager;
                    gameScreenDataEmitter = instances.gameScreenDataEmitter;

                    //user is being created and values assigned to properties of user object
                    userLogger.createUser(socket.id);
                    userLogger.updateUser(socket.id, {name: data.name});
                    userLogger.updateUser(socket.id, {room: room});
                    userLogger.updateUser(socket.id, {strategy: data.strategy});
                    const playerColor = PreGameManager.getColor(socket.id, jsonFileHandler);
                    userLogger.updateUser(socket.id, {color: playerColor})

                    //Updates the gameState object in the json file
                    PreGameManager.addStrategy(data.strategy.toLowerCase(), jsonFileHandler);
                    PreGameManager.addPlayerName(data.name, jsonFileHandler);


                    socketManager.emitToMod(socket,'add_user',"adding");
                    joinStatus = 'available';
                    socketManager.emitBackToClient(socket, 'join_succes', joinStatus);
                    gameScreenDataEmitter.sendPiecesData(socket);
                    gameScreenDataEmitter.sendPlayerColors(socket);
                   //socketManager.emitBackToClient(socket,)

                } else {
                    // checks if joinStatus is undefined to prevent overwriting previous assignment.
                    // The conditions are checked in a specific order.
                    joinStatus = !isValidRoom ? 'Room does not exist' : undefined;
                    joinStatus = !isStrategyAssigned && !joinStatus ? 'Choose a strategy' : joinStatus;
                    joinStatus = !isStrategyUnique && !joinStatus ? 'Strategy already in use' : joinStatus;
                    joinStatus = !isNameUnique && !joinStatus ? 'Name already in use' : joinStatus;
                    joinStatus = isRoomFull && !joinStatus ? 'Room is full' : joinStatus;
                    socketManager.emitBackToClient(socket, 'join_succes', joinStatus);
                }
            },

            'reconnect_player': (sessionData) =>{
                try {
                    const room = sessionData.room;
                    const isValidRoom = PreGameManager.checkIfValidRoom(room, RoomGenerator.getRoomList())

                    if (!isValidRoom) {
                        socketManager.emitBackToClient(socket, 'go_to_home_screen');
                    }
                    else {
                        socket.room = room;
                        socket.join(room)
                        socket.join(`${room}players`)

                        const instances = instanceFactory(room, socketManager,modQuestionQueue);
                        jsonFileHandler = instances.jsonFileHandler;
                        modLogger = instances.modLogger;
                        userLogger = instances.userLogger;
                        gameStateTracker = instances.gameStateTracker;
                        gameManager = instances.gameManager;
                        gameScreenDataEmitter = instances.gameScreenDataEmitter;

                        const reconnectionManager = new ReconnectionManager(userLogger, modLogger, gameScreenDataEmitter, gameManager, socketManager, gameStateTracker);
                        reconnectionManager.reconnectPlayer(socket, sessionData);

                        playerQuestionQueue.reconnectToQueue(socket, sessionData);
                        const questionQueueLength = playerQuestionQueue.getQuestionQueueLength(socket);
                        if (questionQueueLength > 0) {
                            const questionData = playerQuestionQueue.getQuestionFromQueue(socket);
                            socketManager.emitBackToClient(socket, 'receive_question', questionData);
                            playerQuestionQueue.removeQuestionFromQueue(socket);
                        }
                    }
                }
                catch (exception){
                    console.log(exception)
                    console.error("Can't reconnect player")
                }
            },

            'reconnect_mod': (sessionData) =>{
                try {
                    const room = sessionData.room;
                    const isValidRoom = PreGameManager.checkIfValidRoom(room, RoomGenerator.getRoomList())
                    if (!isValidRoom) {
                        socketManager.emitBackToClient(socket, 'go_to_home_screen');
                    }
                    else {
                        socket.room = room;
                        socket.join(room);
                        socket.join(`${room}mod`);

                        const instances = instanceFactory(room, socketManager,modQuestionQueue);
                        jsonFileHandler = instances.jsonFileHandler;
                        modLogger = instances.modLogger;
                        userLogger = instances.userLogger;
                        gameStateTracker = instances.gameStateTracker;
                        gameManager = instances.gameManager;
                        gameScreenDataEmitter = instances.gameScreenDataEmitter;

                        const reconnectionManager = new ReconnectionManager(userLogger, modLogger, gameScreenDataEmitter, gameManager, socketManager, gameStateTracker);
                        reconnectionManager.reconnectMod(socket, sessionData);

                        const questionQueueLength = modQuestionQueue.getQuestionQueueLength(socket);
                        if (questionQueueLength > 0) {
                            const question = modQuestionQueue.getQuestionFromQueue(socket);
                            gameManager.sendAnswerToModerator(socket, question);
                        }
                    }
                }
            catch (exception){
                    console.error("Can't reconnect moderator")
                }
            },

            'send_question_request': async (data) => {  //Hier wordt dus de vraag naar de speler gestuurd
                const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
                const language = userLogger.getLanguage(socket.id);
                const { question, answer } = await databaseQuestion(data.questionColor, sort = language);
                let popupColor
                if (data.questionColor === 'rainbow') {
                    data.questionColor = data.userColor
                    popupColor = data.userColor;
                }
                switch (data.questionColor) {
                    case 'chance':
                        popupColor = 'black1';
                        break;
                    case 'sales':
                        popupColor = 'black2';
                        break;
                    case 'megatrends':
                        popupColor = 'black3';
                        break;
                    default:
                        popupColor = data.questionColor;
                }

                const questionData = {questionText: question, questionColor: popupColor, playerColor: data.userColor, answer: answer};
                if (availableColors.includes(data.questionColor)){ //is het een kleurvraag?
                    const receiver = userLogger.getReceiver(data.questionColor);
                    const playerFinishedTurn = userLogger.checkIfPlayerHasFinishedTurn(socket.id);
                    //naar wie moet de vraag? gaat om de kleur van het vakje, niet speler zelf. receiver krijgt vraag socket.id gaat om degene die op het vakje staat
                    if (receiver !== socket.id && !playerFinishedTurn){//wanneer speler op ander vakje komt staat deze gelijk als gereviewed, anders blijft icoontje grijs en kan verwarrend zijn
                        userLogger.updateUser(socket.id,{hasBeenReviewed: true});
                        socketManager.emitToMod(socket, 'player_has_been_reviewed', {playerId: socket.id, hasBeenReviewed: true});
                    }
                    const playerIsAnsweringQuestion = userLogger.checkIfPlayerIsAnsweringQuestion(receiver);
                    if (playerIsAnsweringQuestion){ //vraag in de queue als speler al bezig is met antwoorden
                        playerQuestionQueue.addQuestionToQueue(socket,receiver,questionData);
                        console.log('playerQuestionQueue:', JSON.stringify(playerQuestionQueue));
                    }
                    else { //speler kan de vraag direct beantwoorden
                        socketManager.emitToSpecificSocket(receiver, 'receive_question', questionData);
                        userLogger.setIsAnsweringQuestion(true,receiver);
                        socketManager.emitToMod(socket, 'player_is_answering', {playerId: receiver, isAnsweringQuestion: true});
                    }
                } else { // het is geen kleurvraag, maar een regenboog of zwarte kleur, die kan alleen naar speler zelf
                    socketManager.emitBackToClient(socket,'receive_question',questionData);
                    userLogger.setIsAnsweringQuestion(true, socket.id);
                    socketManager.emitToMod(socket, 'player_is_answering', {playerId: socket.id, isAnsweringQuestion: true});
                }
            },

            'get_player_answer_on_click': (playerId) => {
                gameManager.checkIfQueueNotEmptyAndSendAnswer(socket, playerId);
            },

            'send_answer_to_server': (questionData) => {
                //await gameManager.waitForModToFinishReview(modLogger);
                modQuestionQueue.addQuestionToQueue(socket, socket.id, questionData);
                console.log('modQuestionQueue:', JSON.stringify(modQuestionQueue));
                // Check if the question queue of the player who sent the question to the server contains any questions.
                if (playerQuestionQueue.getQuestionQueueLength(socket) > 0 ){
                    const questionData = playerQuestionQueue.getQuestionFromQueue(socket);
                    socketManager.emitBackToClient(socket, 'receive_question', questionData);
                    playerQuestionQueue.removeQuestionFromQueue(socket);
                } else {
                    userLogger.setIsAnsweringQuestion(false, socket.id);
                }

              },

            'send_answer_request' :  async (data) => {
                const room = socket.room;
                let answerText = await databaseAnswer(data.answerColor, 'answer');
                socket.to(room).emit('receive_answer', answerText);
                socket.emit('receive_answer', answerText);
            },

            'change_language' : (data) => {
                userLogger.updateUser(socket.id, {language : data})
            },

            'update_position' : (data) => {
                socketManager.emitToRoom(socket,'update_position',data);
            },

            'update_piece_positions': () => {
                gameScreenDataEmitter.sendPositionsData(socket);
            },

            'pawns_request_failed' : (data) => { // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const strategy = gameStateTracker.getStrategies()
                socketManager.emitBackToClient(socket,'players_turn', strategy);
            },


            'get_player_strategy': (data) => { // event moet anders
                const strategy = userLogger.getStrategy(socket.id);
                const color = userLogger.getColor(socket.id);
                socketManager.emitBackToClient(socket,"register_current_player", {strategy: strategy, color: color});
            },

            'get_current' : (data) => { // // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const strategy = gameStateTracker.getStrategies();
                socketManager.emitBackToClient(socket,'set_current_player', strategy);
            },

            'get_player_count': ()=>{
                gameManager.sendPlayerCount(socket);
            },

            'update_hasFinishedTurn': (hasFinishedTurn)=>{
                userLogger.updateUser(socket.id,{hasFinishedTurn: hasFinishedTurn})
                socketManager.emitToMod(socket,'player_has_finished_turn', {playerId: socket.id, hasFinishedTurn: hasFinishedTurn});
            },

            'update_player_position': (playerPosition) => { // playerPostion =  {newPosition: newPosition, selectedPawn: selectedPawn.id}
                userLogger.updateUser(socket.id, {playerPosition: playerPosition});
            },


            'points_submitted_question_reviewed': (reviewData) => {
                //submit points zou niet meteen afgehandeld moeten worden, aangezien er binnen een ronde meerdere keren punten gegeven kunnen worden aan dezelfde speler.
                //Hierdoor kan in één ronde de previous points al zichtbaar zijn, terwijl dat pas in de volgende ronde zichtbaar moet zijn.
                const id = reviewData.playerId;
                const oldTotalPoints = userLogger.getPoints(id);
                const newTotalPoints = Number(oldTotalPoints) + Number(reviewData.totalPoints);
                userLogger.updateUser(id,{totalPoints : newTotalPoints, previousPoints: oldTotalPoints});

                modLogger.updateNumberOfQuestionsReviewed();
                modQuestionQueue.removeQuestionFromQueue(socket, id);
                modLogger.setIsReviewingQuestion(false);
                gameManager.checkIfQueueNotEmptyAndSendAnswer(socket, id);


                const isRoundFinished = gameStateTracker.checkIfRoundIsFinished();
                if (isRoundFinished) { // Update Game state and go to next round
                    modLogger.resetNumberOfQuestionsReviewed();
                    userLogger.resetHasFinishedTurn(); // Is waarschijnlijk niet meer nodig
                    gameManager.updateGameState(socket);
                    gameManager.startRound(socket);
                    gameManager.updatePiecePositions(socket);
                    socketManager.emitToMod(socket, 'reset_player_progress_styles');
                }
              },

            /////// Events staan tijdelijk in dit bestand
            'get_tileInfo': (data) => {
                gameScreenDataEmitter.sendBoardData(socket);
            },

            'roll_dice' : (playerRollDice) => {
                const diceValue = Math.floor(Math.random() * 6) + 1;
                socket.emit("set_dice", diceValue)
                const canRollDice = userLogger.getCanRollDice(socket.id);

                if (canRollDice && playerRollDice) { //if its truly players turn do this
                        userLogger.setCanRollDice(socket.id, false);
                        socketManager.emitToSpecificSocket(socket.id, 'set_roll_dice', false);
                }
            },

            'send_dice_roll_and_position': (data) => {
                const coordinate = data.position.split('-');
                const xPos = parseInt(coordinate[0]);
                const yPos = parseInt(coordinate[1]);
                const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);
                let formattedPositions = moves.map(pos => `${pos.x}-${pos.y}`);
                socket.emit('update_valid_positions', formattedPositions);
            },

            'start_turn' : (data) => {
                gameManager.startRound(socket);
            },

            'get_pieces': (data) => {
                const pieces = gameStateTracker.getStrategies();
                gameScreenDataEmitter.sendPiecesData(socket);
                socketManager.emitToRoom(socket,'add_player_color',pieces); // moet een eigen event voor komen

            },
            'link_player_to_piece': () =>{
                const strategy = userLogger.getStrategy(socket.id);
                socketManager.emitBackToClient(socket,'players_turn',strategy);

            },

            'get_results' : () => {
            console.log('results');
                            const room = socket.room;
                            const users = userLogger.getScores();
                            const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);

                            socketManager.emitBackToClient(socket,'show_results', sortedUsers);
                        }
        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })
    })
}