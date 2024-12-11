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

        if(RoomGenerator.getRoomList().length < 1) {
            io.emit('go_to_home_screen');
        }


        const socketHandlers = {
            //create_room is the entry point for the moderator
            //data is an object consisting of playercount and roundscount.
            'create_room': (data) => {
                const room = RoomGenerator.createRoom();
                const instances = instanceFactory(room,socketManager);
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

                    const instances = instanceFactory(room,socketManager);
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
                    const pieces = gameStateTracker.getStrategies();
                    gameScreenDataEmitter.sendPiecesData(socket);

                    socketManager.emitBackToClient("add_player_color",pieces);

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
                    if(!isValidRoom){
                        socketManager.emitBackToClient(socket,'go_to_home_screen');
                    }

                    socket.room = room;
                    socket.join(room)
                    socket.join(`${room}players`)

                    const instances = instanceFactory(room, socketManager);
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
                catch (exception){
                    console.log(exception)
                    console.error("Can't reconnect player")
                }
            },

            'reconnect_mod': (sessionData) =>{
                try {
                    const room = sessionData.room;
                    const isValidRoom = PreGameManager.checkIfValidRoom(room, RoomGenerator.getRoomList())
                    if(!isValidRoom){
                        socketManager.emitBackToClient(socket,'go_to_home_screen');
                    }

                    socket.room = room;
                    socket.join(room);
                    socket.join(`${room}mod`);


                    const instances = instanceFactory(room, socketManager);
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
            catch (exception){
                    console.error("Can't reconnect moderator")

                }
            },

            'send_question_request': async (data) => {  //Hier wordt dus de vraag naar de speler gestuurd
                const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
                const language = userLogger.getLanguage(socket.id);
                const { question, answer } = await databaseQuestion(data.questionColor, sort = language);
                let get_player_strategy
                console.log("Data.userColor: " + data.userColor)
                console.log("Data.questionColor: " + data.questionColor)
                if (data.questionColor === 'rainbow') {
                    data.questionColor = data.userColor
                    get_player_strategy = data.userColor;
                }
                switch (data.questionColor) {
                    case 'chance':
                        get_player_strategy = 'black1';
                        break;
                    case 'sales':
                        get_player_strategy = 'black2';
                        break;
                    case 'megatrends':
                        get_player_strategy = 'black3';
                        break;
                    default:
                        get_player_strategy = data.questionColor;
                }

                const questionData = {
                    questionText: question,
                    questionColor: get_player_strategy,
                    playerColor: data.userColor,
                    answer: answer
                };
                if (availableColors.includes(data.questionColor)) {
                    const receiver = userLogger.getReceiver(data.questionColor);
                    const playerIsAnsweringQuestion = userLogger.checkIfPlayerIsAnsweringQuestion(receiver);
                    playerQuestionQueue.addQuestionToQueue(socket, receiver, questionData)
                    if (!playerIsAnsweringQuestion) {
                        socketManager.emitToSpecificSocket(receiver, 'receive_question', questionData);
                        userLogger.setIsAnsweringQuestion(true, receiver);
                    }
                }
                else {
                    playerQuestionQueue.addQuestionToQueue(socket, socket.id, questionData)
                    socketManager.emitBackToClient(socket, 'receive_question', questionData);
                    userLogger.setIsAnsweringQuestion(true, socket.id);
                }
            },

            'send_answer_to_server': (questionData) => {

                modQuestionQueue.addQuestionToQueue(socket, questionData);
                const isReviewingQuestion = modLogger.checkIfReviewingQuestion();
                console.log( "IN send answer to server")
                // Checks if the mod is already reviewing a question.
                if (!isReviewingQuestion) {
                    console.log( "IN if stetmenrt")
                    gameManager.sendAnswerToModerator(socket, questionData);
                    modLogger.setIsReviewingQuestion(true);
                }

                playerQuestionQueue.removeQuestionFromQueue(socket);
                // Check if the question queue of the player who sent the question to the server contains any questions.
                if (playerQuestionQueue.getQuestionQueueLength(socket) > 0) {
                    const questionData = playerQuestionQueue.getQuestionFromQueue(socket);
                    socketManager.emitBackToClient(socket, 'receive_question', questionData);
                } else {
                    userLogger.setIsAnsweringQuestion(false, socket.id);
                }

              },

            'send_answer_request': async (data) => {
                const room = socket.room;
                let answerText = await databaseAnswer(data.answerColor, 'answer');
                socket.to(room).emit('receive_answer', answerText);
                socket.emit('receive_answer', answerText);
            },

            'change_language': (data) => {
                userLogger.updateUser(socket.id, {language: data})
            },


            'submit_points' : (data) => {
                const id = data.playerId;
                const oldPoints = userLogger.getPoints(id);
                const newPoints = Number(oldPoints) + Number(data.totalPoints);
                userLogger.updateUser(id, {totalPoints: newPoints})
            },


            'update_piece_positions': () => {
                 gameScreenDataEmitter.sendNewPositionsData(socket);
            },

            'pawns_request_failed': (data) => { // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const strategy = gameStateTracker.getStrategies()
                socketManager.emitBackToClient(socket, 'players_turn', strategy);
            },


            'get_player_strategy': (data) => {
                const strategy = userLogger.getStrategy(socket.id);
                const color = userLogger.getColor(socket.id);
                socketManager.emitBackToClient(socket, "register_current_player", {strategy: strategy, color: color});
            },

            'get_current': (data) => { // // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const strategy = gameStateTracker.getStrategies();
                socketManager.emitBackToClient(socket, 'set_current_player', strategy);
            },

            'get_player_count': () => {
                gameManager.sendPlayerCount(socket);
            },

            'update_hasFinishedTurn': (hasFinishedTurn) => {
                userLogger.updateUser(socket.id, {hasFinishedTurn: hasFinishedTurn})
            },

            'update_player_position': (playerPosition) => { // playerPostion =  {newPosition: newPosition, selectedPawn: selectedPawn.id}
                userLogger.updateUser(socket.id, {playerPosition: playerPosition});
            },


            'question_reviewed': () => {
                modQuestionQueue.removeQuestionFromQueue(socket);
                modLogger.updateNumberOfQuestionsReviewed();
                const questionQueueLength = modQuestionQueue.getQuestionQueueLength(socket);

                if (questionQueueLength > 0) {
                    const question = modQuestionQueue.getQuestionFromQueue(socket);
                    gameManager.sendAnswerToModerator(socket,question);
                }

                else {// Queue is empty
                    modLogger.setIsReviewingQuestion(false);
                    const isRoundFinished = gameStateTracker.checkIfRoundIsFinished();
                    if (isRoundFinished) { // Go to next round
                        modLogger.resetNumberOfQuestionsReviewed();
                        userLogger.resetHasFinishedTurn(); // Is waarschijnlijk niet meer nodig
                        gameManager.updateGameState(socket);
                        gameManager.updatePiecePositions(socket);
                        gameManager.startRound(socket);
                    }
                }



            },

            /////// Events staan tijdelijk in dit bestand
            'get_tileInfo': (data) => {

                //TILE_INFO FOR WHEN 2-6 PLAYERS JOIN
                const tileInfo = [
                    'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
                    'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
                    'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
                    'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
                    'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
                    'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
                    'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
                    'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
                    'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
                ]

                //TILE_INFO FOR WHEN 5 PLAYERS JOIN
                const tileInfo2 = [
                    'sales','color1','color5','megatrends','rainbow','color4','chance', 'color2', 'color1', 'sales','rainbow', 'color3','megatrends','color4','color2',
                    'color3','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
                    'chance','blank','blank','blank','blank','blank', 'blank', 'color5', 'blank','blank','blank', 'blank', 'blank','blank','color5',
                    'color5','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank','rainbow',
                    'rainbow','sales','color2','chance', 'color1','megatrends', 'color4', 'start', 'rainbow', 'sales','color4', 'megatrends', 'color1','color3', 'sales',
                    'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'color5',
                    'color4','blank', 'blank', 'blank', 'blank','blank', 'blank', 'color3', 'blank', 'blank','blank','blank','blank','blank','color4',
                    'color5', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
                    'sales', 'rainbow', 'color5', 'chance', 'color2','color1', 'megatrends', 'rainbow', 'color5', 'sales','color2','color3', 'chance', 'rainbow', 'color5'
                ]

                socketManager.emitBackToClient(socket,'send_tileInfo', tileInfo);
                socketManager.emitBackToClient(socket,'send_tileInfo2', tileInfo2);
            },

            'roll_dice' : (playerRollDice) => {
                const diceValue = Math.floor(Math.random() * 6) + 1;
                socket.emit("set_dice", diceValue)
                const canRollDice = userLogger.getCanRollDice(socket.id);
                console.log('userlogger is prolly not defined' + userLogger);

                if (canRollDice && playerRollDice) { //if its truly players turn do this
                        userLogger.setCanRollDice(socket.id, false);
                        socketManager.emitToSpecificSocket(socket.id, 'set_roll_dice', false);
                        console.log('canRollDice vergelijken' + canRollDice + ' en ' + playerRollDice);
                }
            },

            'send_dice_roll_and_position': (data) => {
                console.log("in dice event")
                console.log(data)
                console.log(data.position)
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
                console.log("socket getPieces: ",socket.id);
                const pieces = gameStateTracker.getStrategies();
                gameScreenDataEmitter.sendPiecesData(socket);
                socketManager.emitToRoom(socket,'add_player_color',pieces); // moet een eigen event voor komen

            },
            'link_player_to_piece': () =>{
                console.log("Kokm linkkken");
                console.log(modLogger)
                console.log(gameManager)
                console.log(gameScreenDataEmitter)
                const strategy = userLogger.getStrategy(socket.id);
                console.log(strategy)
                socketManager.emitBackToClient(socket,'players_turn',strategy);
            }



        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })
    })


}