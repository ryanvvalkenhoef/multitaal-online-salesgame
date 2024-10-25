const modLogger = require("./modLogger");
const databaseQuestion = require("./database");
const userLogger = require("./userLogger");
const databaseAnswer = require("./database");
const getMovesFromCoordinate = require("./positionCalculator");
const GameManager = require('./gameMethods');
const questionQueue = require("./questionQueue");
const SocketManager = require("./socketMethods");
const { json } = require("express");




module.exports = function (io){

    io.on('connection', (socket) => {

        const socketManager = new SocketManager(io);
        const gameManager = new GameManager(io,userLogger,modLogger,socketManager)
        

        const socketHandlers = {

            'create_room': (data) => {
                const room = modLogger('', 'log', socket.id, data);
                const playersNeeded = modLogger(room, 'getPlayerTotal', socket.id,'',room);
                socket.emit('send_gamepin', {room: room, playerTotal: playersNeeded});
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
                userLogger(data.room, 'log', socket.id,'')
                var exists = modLogger(data.room, 'checkExists', socket.id,data.room)
                if (exists === 'exists') {
                    socket.join(data.room);
                    socket.join(`${data.room}players`);
                    socket.room = data.room;
                    room = socket.room;
                    var availability = userLogger(room,'checkAvailability', socket.id, data)
                   

                } else{
                    availability = 'Room does not exist'
                }
                if(data.strategy === ''){
                    availability = 'Choose a strategy'
                }
                var roomIsFull = modLogger(room, 'checkFull', socket.id, data.room)
                if (roomIsFull === 'full') {
                    availability = 'Room is full'
                }
                if (availability === 'available') {
                    socketManager.emitToMod(socket,'add_user',"adding");
                    userLogger(room, 'updateName', socket.id, data.name)
                    userLogger(room, 'updateRoom', socket.id, data.room)
                    userLogger(room, 'updateStrategy', socket.id, data.strategy)

                    const playerColor = userLogger(room, 'getColor',socket.id)
                    userLogger(room, 'addColorToPlayer',socket.id,playerColor)
                    modLogger(room, 'addPlayer', socket.id, data.strategy.toLowerCase())
                    modLogger(room, 'addPlayerName', socket.id, data.name)

                    const pieces = modLogger(room, 'getPieces');
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
                const language = userLogger(room, 'getLanguage', socket.id)
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
                    const receiver = userLogger(room, 'getReceiver', socket.id, {color: data.questionColor, room: room})
                    socketManager.emitToSpecificSocket(receiver,'receive_question',questionData);
                } else {
                    socketManager.emitBackToClient(socket,'receive_question',questionData);
                }
            },

            'send_answer_to_server': (questionData) => {
                const room = socket.room;
                const questionQueueLength = questionQueue.getQuestionQueueLenght(room);
                const isReviewingQuestion = modLogger(room, "checkIfReviewingQuestion");
                
                if (questionQueueLength === 0 && !isReviewingQuestion) {
                    gameManager.sendAnswerToModerator(socket,questionData);
                    modLogger(room, "setIsReviewingQuestion", "", true);
                } else {
                    questionQueue.addQuestionToQueue(questionData,room);
                }

              },

            'send_answer_request' :  async (data) => {
                const room = socket.room;
                let answerText = await databaseAnswer(data.answerColor, 'answer');
                // const room = userLogger(room, 'getRoom', socket.id);
                socket.to(room).emit('receive_answer', answerText);
                socket.emit('receive_answer', answerText);
            },

            'change_language' : (data) => {
                const room = socket.room;
                userLogger(room, 'updateLanguage', socket.id, data)
            },

            'send_points' : (data) => {
                const room = socket.room;
                const oldPoints = userLogger(room, 'getPoints', socket.id);
                const points = userLogger(room, 'updatePoints', socket.id, parseInt(oldPoints + data.points));
            },

            'submit_points' : (data) => {
                const room = socket.room;
                const id = data.playerId;
                const oldPoints = userLogger(room, 'getPoints', id, id);
                const newPoints = Number(oldPoints) + Number(data.points);
                userLogger(room, 'updatePoints', id, newPoints);
            },

            'settings' : (data) => {
                const room = socket.room;
                modLogger(room, 'updateSettings', socket.id, data)
            },

            'send_textbox_content' : (data) => {
                socketManager.emitToMod(socket,'submitted_answer',data);
            },

            'update_position' : (data) => {
                socketManager.emitToRoom(socket,'update_position',data);
            },

            'pawns_request_failed' : (data) => {
                const room = socket.room;
                const modID = modLogger(room, 'getMod', socket.id, room);
                const strategy = modLogger(room, 'getPlayerTurn', modID)
                socketManager.emitBackToClient(socket,'players_turn', strategy);
            },

            'get_data' : (userData) => { // event isn't being used
                const room = socket.room;
                //const room = userLogger(room, 'getRoom', socket.id);
                userData = userLogger(room, 'getData', socket.id);
                //socket.to(room).emit('data_leaderboard', userData);
                io.emit('data_leaderboard', userData);
                socket.to("mod").emit('data_leaderboard', userData)
                //socket.emit('data_leaderboard', userData);
                //socket.to("mod").emit('data_leaderboard',userData)
            },

            'get_playerstrategy' : (data) => {
                const room = socket.room;
                const strategy = userLogger(room, 'getStrategy', socket.id);
                const color = userLogger(room, 'getColor', socket.id);
                socketManager.emitBackToClient(socket,"register_currentplayer", {strategy: strategy, color: color});
            },

            'get_current' : (data) => {
                const room = socket.room;
                const strategy = modLogger(room, 'getPlayerTurn', socket.id)
                socketManager.emitBackToClient(socket,'set_current_player', strategy);
            },

            'get_player_count': ()=>{
                gameManager.sendPlayerCount(socket);
            },

            'updateHasFinishedTurn': (hasFinishedTurn)=>{
                const room = socket.room;
                userLogger(room, 'updateHasFinishedTurn',socket.id,hasFinishedTurn);
            },

            'updatePlayerPosition': (playerPosition) =>{ // playerPostion =  {newPosition: newPosition, selectedPawn: selectedPawn.id}
                const room = socket.room;
                userLogger(room, 'updatePlayerPosition', socket.id,playerPosition);
            },


            'question_reviewed': () => {
                const room = socket.room;
                questionQueueLength = questionQueue.getQuestionQueueLenght(room);
                
                if (questionQueueLength > 0) {
                    const question = questionQueue.getQuestionFromQueue(room);
                    gameManager.sendAnswerToModerator(socket, question);
                }
                // when queue is empty but not all players have submitted
                else {
                  modLogger(room, "setIsReviewingQuestion", "", false);
                }

                const isReviewingQuestion = modLogger(room,"checkIfReviewingQuestion");
                const isRoundFinished = modLogger(room,'checkIfRoundIsFinished');
                if (isRoundFinished && !isReviewingQuestion) { //update Game state and next round
                    
                    modLogger(room, 'resetRoundStatus');
                    userLogger(room, 'resetHasFinishedTurn');
                    gameManager.updateGameState(io,socket);
                    gameManager.updateAllBoards(socket);
                    gameManager.startRound(socket);
        
                }
                
              },
            


        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])})
    })
}