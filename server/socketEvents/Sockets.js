const modLogger = require("../Loggers/modLogger");
const databaseQuestion = require("../database");
//const userLogger = require("../Loggers/userLogger");
const databaseAnswer = require("../database");
const getMovesFromCoordinate = require("../positionCalculator");
const GameManager = require('../GameManager');
// const questionQueue = require("./questionQueue/questionQueue");
const SocketManager = require("../Socket/SocketManager");
const PlayerQuestionQueue = require('../questionQueue/PlayerQuestionQueue');
const ModQuestionQueue = require("../questionQueue/ModQuestionQueue");
const ModLoggerManager = require('../Loggers/ModLoggerManager');
const UserLoggerManager = require('../Loggers/UserLoggerManager');
const RoomGenerator = require('../roomGenerator/RoomGenerator');
const PreGameManager = require('../preGameManager/PreGameManager')
const GameStateTrackerManager = require("../gameState/GameStateTrackerManager");
const createJsonFile  = require('../jsonFileGenerator/jsonFileGenerator');




module.exports = function (io){

    const playerQuestionQueue = new PlayerQuestionQueue();
    const modQuestionQueue = new ModQuestionQueue();


    io.on('connection', (socket) => {

        const socketManager = new SocketManager(io);
        //const gameManager = new GameManager(io,userLogger,modLogger,socketManager)
        /** @type {GameManager} */
        let gameManager;
        /** @type {ModLogger} */
        let ModLogger;
        /** @type {GameStateTracker} */
        let GameStateTracker;
        /** @type {UserLogger} */
        let userLogger;


        const socketHandlers = {

            'create_room': (data) => { // data is an object consisting of playercount and roundscount
                const room = RoomGenerator.createRoom();
                createJsonFile(room);
                ModLogger = ModLoggerManager.getModLogger(room);
                ModLogger.addMod(socket.id,data);

                userLogger = UserLoggerManager.getModLogger(room);

                GameStateTracker = GameStateTrackerManager.getGameStateTracker(room); //Get a GameStateTracker for current room
                PreGameManager.setTotalPlayers(data.playerCount,room);
                PreGameManager.setTotalRounds(data.roundsCount,room);

                gameManager = new GameManager(io,userLogger,ModLogger,socketManager,GameStateTracker);

                socket.emit('send_gamepin', {room: room, playerTotal: data.playerCount});
                socket.room = room; // adds room code as property to socket object
                socket.join(`${room}mod`);
                socket.join(room);
            },

            'disconnect': (reason) => {
                // const room = userLogger(room, "getRoom", socket.id)
                // const name = userLogger(room, 'getPlayerNames', socket.id)
                // modLogger(room, 'removeUser', socket.id, {name: name, room: room})
                // socket.to(userLogger(room, "getRoom", socket.id)).emit('delete_user', "deleting")
                // userLogger(room, "delete", socket.id)
                // modLogger(room, "delete", socket.id)
            },

            'join_room' : (data) => {
                let room;
                let availability;

                const existingRooms = RoomGenerator.getRoomList();
                const validRoom = PreGameManager.checkIfValidRoom(data.room, existingRooms)
                if (validRoom) {
                    console.log("valid room");
                    socket.join(data.room);
                    socket.join(`${data.room}players`);
                    socket.room = data.room;
                    console.log("socket id in sockets: " + socket.id);
                    room = socket.room;
                    availability = 'available';

                } else{
                    availability = 'Room does not exist'
                }
                if(data.strategy === ''){
                    availability = 'Choose a strategy'
                }
                const roomIsFull = PreGameManager.checkIfRoomFull(room)
                if (roomIsFull === 'full') {
                    availability = 'Room is full'
                }
                if (availability === 'available') { // All info is valid player can join the game.

                    GameStateTracker = GameStateTrackerManager.getGameStateTracker(room);//Get a GameStateTracker for current room
                    gameManager = new GameManager(io,userLogger,ModLogger,socketManager,GameStateTracker);
                    ModLogger = ModLoggerManager.getModLogger(room);
                    userLogger = UserLoggerManager.getModLogger(room);
                    userLogger.createUser(socket.id);

                    userLogger.updateUser(socket.id,{name :data.name});
                    userLogger.updateUser(socket.id,{room:room});
                    userLogger.updateUser(socket.id,{strategy: data.strategy});

                    const playerColor = userLogger.getColor(socket.id);
                    userLogger.updateUser(socket.id, {color: playerColor})

                    PreGameManager.addStrategy(data.strategy.toLowerCase(),room);
                    PreGameManager.addPlayerName(data.name,room);



                    const pieces = GameStateTracker. getStrategies();
                    console.log("pieces: " + pieces);
                    socketManager.emitToMod(socket,'add_user',"adding");
                    socketManager.emitBackToClient(socket,'join_succes',availability);
                    socketManager.emitBackToClient(socket,'add_piece',pieces);
                    socketManager.emitToPlayers(socket,'add_piece',pieces);
                } else {
                    socketManager.emitBackToClient(socket,'join_succes',availability);
                }
            },

            'send_question_request': async (data) => {  //Hier wordt dus de vraag naar de speler gestuurd
                const room = socket.room;
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
                if (availableColors.includes(data.questionColor)){
                    const receiver = userLogger.getReceiver(data.questionColor);
                    const playerIsAnsweringQuestion = userLogger.checkIfPlayerIsAnsweringQuestion(receiver);
                    if(playerIsAnsweringQuestion){
                        playerQuestionQueue.addQuestionToQueue(socket,receiver,questionData)
                    }
                    else {
                        socketManager.emitToSpecificSocket(receiver, 'receive_question', questionData);
                        userLogger.setIsAnsweringQuestion(true,socket.id);
                    }
                } else {
                    socketManager.emitBackToClient(socket,'receive_question',questionData);
                    userLogger.setIsAnsweringQuestion(true, socket.id);
                }
            },

            'send_answer_to_server': (questionData) => {
                const room = socket.room;

;               const questionQueueLength = modQuestionQueue.getQuestionQueueLength(socket);
                const isReviewingQuestion = ModLogger.checkIfReviewingQuestion();

                if (questionQueueLength === 0 && !isReviewingQuestion) {
                    gameManager.sendAnswerToModerator(socket,questionData);
                    ModLogger.setIsReviewingQuestion(true);
                } else {
                    modQuestionQueue.addQuestionToQueue(socket,questionData);
                }

                //checking player question queue
                if(playerQuestionQueue.getQuestionQueueLength(socket) > 0 ){
                    const questionData = playerQuestionQueue.getQuestionFromQueue(socket);
                    socketManager.emitBackToClient(socket,'receive_question',questionData);
                    playerQuestionQueue.removeQuestionFromQueue(socket);

                }
                else{
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
                const room = socket.room;
                userLogger.updateUser(socket.id, {language : data})
            },


            'submit_points' : (data) => {
                const room = socket.room;
                const id = data.playerId;
                const oldPoints = userLogger.getPoints(id);
                const newPoints = Number(oldPoints) + Number(data.points);
                userLogger.updateUser(id,{points : newPoints})
            },

            // 'settings' : (data) => {
            //     const room = socket.room;
            //     modLogger(room, 'updateSettings', socket.id, data)
            // },

            'send_textbox_content' : (data) => {
                socketManager.emitToMod(socket,'submitted_answer',data);
            },

            'update_position' : (data) => {
                socketManager.emitToRoom(socket,'update_position',data);
            },

            'pawns_request_failed' : (data) => { // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const room = socket.room;
                const strategy = GameStateTracker.getStrategies()
                socketManager.emitBackToClient(socket,'players_turn', strategy);
            },

            'get_data' : (userData) => { // event wordt niet gebruikt
                const room = socket.room;
                userData = userLogger.getData();
                io.emit('data_leaderboard', userData);
                socket.to("mod").emit('data_leaderboard', userData)

            },

            'get_playerstrategy' : (data) => {
                const room = socket.room;
                const strategy = userLogger.getStrategy(socket.id);
                const color = userLogger.getColor(socket.id);
                socketManager.emitBackToClient(socket,"register_currentplayer", {strategy: strategy, color: color});
            },

            'get_current' : (data) => { // // werkt nu  niet correct omdat method nu array geeft ipv een strategie
                const room = socket.room;
                const strategy = GameStateTracker.getStrategies();
                socketManager.emitBackToClient(socket,'set_current_player', strategy);
            },

            'get_player_count': ()=>{
                gameManager.sendPlayerCount(socket);
            },

            'updateHasFinishedTurn': (hasFinishedTurn)=>{
                userLogger.updateUser(socket.id,{hasFinishedTurn: hasFinishedTurn})
            },

            'updatePlayerPosition': (playerPosition) =>{ // playerPostion =  {newPosition: newPosition, selectedPawn: selectedPawn.id}
                userLogger.updateUser(socket.id,{playerPosition: playerPosition});
            },


            'question_reviewed': () => {
                const room = socket.room;
                const questionQueueLength = modQuestionQueue.getQuestionQueueLength(socket);
                ModLogger.updateNumberOfQuestionsReviewed();

                if (questionQueueLength > 0) {
                    const question = modQuestionQueue.getQuestionFromQueue(socket);
                    modQuestionQueue.removeQuestionFromQueue(socket);
                    gameManager.sendAnswerToModerator(socket, question);
                }
                // when queue is empty but not all players have submitted
                else {
                  ModLogger.setIsReviewingQuestion(false);
                }

                const isReviewingQuestion = ModLogger.checkIfReviewingQuestion();
                const isRoundFinished = GameStateTracker.checkIfRoundIsFinished();
                if (isRoundFinished && !isReviewingQuestion) { //update Game state and next round
                    console.log("update round");
                    ModLogger.resetNumberOfQuestionsReviewed();
                    GameStateTracker.resetRoundStatus();
                    userLogger.resetHasFinishedTurn(); // is waarschijnlijk niet meer nodig
                    gameManager.updateGameState(io,socket);
                    gameManager.updateAllBoards(socket);
                    gameManager.startRound(socket);

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

            'roll_dice' : (data) => {
                const diceValue = Math.floor(Math.random() * 6) + 1;
                socket.emit("set_dice", diceValue)
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
                const pieces = GameStateTracker.getStrategies();
                console.log("pieces gamesocket: " + pieces);
                socketManager.emitToRoom(socket,"add_piece",pieces);

            }




        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])})
    })
}