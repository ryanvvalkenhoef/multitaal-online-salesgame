const modLogger = require("./modLogger");
const databaseQuestion = require("./database");
const userLogger = require("./userLogger");
const databaseAnswer = require("./database");
const getMovesFromCoordinate = require("./positionCalculator");
const gameMethods = require('./gameMethods');
const questionQueue = require("./questionQueue");
const { json } = require("express");


module.exports = function (io){

    io.on('connection', (socket) => {
       //userLogger('log', socket.id)
        

        const socketHandlers = {

            'create_room': (data) => {


                const room = modLogger('', 'log', socket.id, data);

                const playerNeeded = modLogger(room, 'getPlayerTotal', socket.id,'',room);
                socket.emit('send_gamepin', {room: room, playerTotal: playerNeeded});
                socket.room = room;
                socket.join(`${room}mod`);
                socket.join(room);
            },

            'disconnect': (reason) => {
                // const room = userLogger(socket.room, "getRoom", socket.id)
                // const name = userLogger(socket.room, 'getPlayerNames', socket.id)
                // modLogger(socket.room, 'removeUser', socket.id, {name: name, room: room})
                // socket.to(userLogger(socket.room, "getRoom", socket.id)).emit('delete_user', "deleting")
                // userLogger(socket.room, "delete", socket.id)
                // modLogger(socket.room, "delete", socket.id)
            },

            'join_room' : (data) => {
                userLogger(data.room, 'log', socket.id,'')
                console.log("data.gamepin: " + data.room);

                var exists = modLogger(data.room, 'checkExists', socket.id,data.room)
                if (exists === 'exists') {
                    socket.join(data.room);
                    socket.join(`${data.room}players`);
                    socket.room = data.room;
                    var availability = userLogger(socket.room,'checkAvailability', socket.id, data)
                    console.log('availablilty: ' + availability);

                } else{
                    availability = 'Room does not exist'
                }
                if(data.strategy === ''){
                    availability = 'Choose a strategy'
                }
                var roomIsFull = modLogger(socket.room, 'checkFull', socket.id, data.room)
                if (roomIsFull === 'full') {
                    availability = 'Room is full'
                }
                if (availability === 'available') {
                    //socket.join(data.room)
                    
                    
                    socket.emit('add_user', "adding")  //socket.to(data.room).emit('add_user', "adding")  Dit was de orginele lijn

                    console.log("socket.room: " + socket.room);
                    userLogger(socket.room, 'updateName', socket.id, data.name)
                    userLogger(socket.room, 'updateRoom', socket.id, data.room)
                    userLogger(socket.room, 'updateStrategy', socket.id, data.strategy)
                    const playerColor = userLogger(socket.room, 'getColor',socket.id)
                    userLogger(socket.room, 'addColorToPlayer',socket.id,playerColor)
                    const modID = modLogger(socket.room, 'getMod', socket.id, data.room)
                    modLogger(socket.room, 'addPlayer', socket.id, data.strategy.toLowerCase()) //socket.id was modID
                    modLogger(socket.room, 'addPlayerName', socket.id, data.name) //socket.id was modID

                    const pieces = modLogger(socket.room, 'getPieces')
                    socket.emit('join_succes', availability);
                    socket.emit('add_piece', pieces);
                    socket.to(`${socket.room}players`).emit('add_piece', pieces);
                } else {
                    socket.emit('join_succes', availability);
                }
            },

            'send_question_request': async (data) => {  //Hier wordt dus de vraag naar de speler gestuurd
                const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
                const language = userLogger(socket.room, 'getLanguage', socket.id)
                const { question, answer } = await databaseQuestion(data.questionColor, sort = language);
                const room = userLogger(socket.room, 'getRoom', socket.id);
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

                if (availableColors.includes(data.questionColor)){
                    const receiver = userLogger(socket.room, 'getReceiver', socket.id, {color: data.questionColor, room: room})
                    io.to(receiver).emit('receive_question', {questionText: question, questionColor: popupColor, playerColor: data.userColor, answer: answer})
                } else {
                    socket.emit('receive_question', {questionText: question, questionColor: popupColor, playerColor: data.userColor, answer: answer});
                }
            },

            'send_answer_to_moderator': (questionData) => {
                const questionQueueLength = questionQueue.getQuestionQueueLenght();
                const isReviewingQuestion = modLogger(socket.room, "checkIfReviewingQuestion");
                if (questionQueueLength === 0 && !isReviewingQuestion) {
                  gameMethods.sendAnswerToModerator(io,questionData);
                  modLogger(socket.room, "setIsReviewingQuestion", "", true);
                } else {
                  questionQueue.addQuestionToQueue(questionData);
                }
              },

            'send_answer_request' :  async (data) => {
                let answerText = await databaseAnswer(data.answerColor, 'answer');
                const room = userLogger(socket.room, 'getRoom', socket.id);
                socket.to(room).emit('receive_answer', answerText);
                socket.emit('receive_answer', answerText);
            },

            'change_language' : (data) => {
                userLogger(socket.room, 'updateLanguage', socket.id, data)
            },

            'send_points' : (data) => {
                const oldPoints = userLogger(socket.room, 'getPoints', socket.id);
                const points = userLogger(socket.room, 'updatePoints', socket.id, parseInt(oldPoints + data.points));
            },

            'submit_points' : (data) => {
                const id = data.playerId;
                //const room = modLogger(socket.room, 'room', socket.id);
                //let name = userLogger(socket.room, 'getPlayerName',id)
                
                const oldPoints = userLogger(socket.room, 'getPoints', id, id);
                const newPoints = Number(oldPoints) + Number(data.points);
                
                userLogger(socket.room, 'updatePoints', id, newPoints);
            },

            'settings' : (data) => {
                modLogger(socket.room, 'updateSettings', socket.id, data)
            },

            'send_textbox_content' : (data) => {
                //const room = userLogger(socket.room, 'getRoom', socket.id);
                socket.to("mod").emit('submitted_answer', data);
            },

            'update_position' : (data) => {
                // const room = userLogger(socket.room, 'getRoom', socket.id);
                // socket.to(room).emit('update_position', data);

                io.emit('update_position', data);
            },

            'pawns_request_failed' : (data) => {
                const room = userLogger(socket.room, 'getRoom', socket.id);
                const modID = modLogger(socket.room, 'getMod', socket.id, room);
                const strategy = modLogger(socket.room, 'getPlayerTurn', modID)
                socket.emit('players_turn', strategy)
            },

            'get_data' : (userData) => {
                //const room = userLogger(socket.room, 'getRoom', socket.id);
                userData = userLogger(socket.room, 'getData', socket.id);
                //socket.to(room).emit('data_leaderboard', userData);
                io.emit('data_leaderboard', userData);
                
                socket.to("mod").emit('data_leaderboard', userData)
                //socket.emit('data_leaderboard', userData);
                //socket.to("mod").emit('data_leaderboard',userData)
            },

            'get_playerstrategy' : (data) => {
                const strategy = userLogger(socket.room, 'getStrategy', socket.id);
                const color = userLogger(socket.room, 'getColor', socket.id);
                socket.emit("register_currentplayer", {strategy: strategy, color: color});
            },

            'get_current' : (data) => {
                const strategy = modLogger(socket.room, 'getPlayerTurn', socket.id)
                socket.emit('set_current_player', strategy)
            },

            'get_player_count': ()=>{
                gameMethods.sendPlayerCount(socket);
            },

            'updateHasFinishedTurn': (hasFinishedTurn)=>{
                userLogger(socket.room, 'updateHasFinishedTurn',socket.id,hasFinishedTurn);

            },

            'updatePlayerPosition': (playerPosition) =>{ // playerPostion =  {newPosition: newPosition, selectedPawn: selectedPawn.id}
                userLogger(socket.room, 'updatePlayerPosition', socket.id,playerPosition);
                
                
            },

            // 'update_game_state' : () =>{
            //     gameMethods.updateGameState(io,socket);
            //     gameMethods.updateAllBoards();
            // },

            'question_reviewed': () => {
                questionQueueLength = questionQueue.getQuestionQueueLenght();
                
                if (questionQueueLength > 0) {
                  const question = questionQueue.getQuestionFromQueue();
                  gameMethods.sendAnswerToModerator(io, question);
                }
                // when queue is empty but not all players have submitted
                else {
                  modLogger(socket.room, "setIsReviewingQuestion", "", false);
                }

                const isReviewingQuestion = modLogger("checkIfReviewingQuestion");
                const isRoundFinished = modLogger('checkIfRoundIsFinished');
                if (isRoundFinished && !isReviewingQuestion) { //update Game state and next round
                    
                    modLogger(socket.room, 'resetRoundStatus');
                    userLogger(socket.room, 'resetHasFinishedTurn');
                    gameMethods.updateGameState(io,socket);
                    gameMethods.updateAllBoards(io);
                    gameMethods.startRound(io,socket);
        
                }
                
              },
            


        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])})
    })
}