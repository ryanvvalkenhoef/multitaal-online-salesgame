// const userLogger = require("../Loggers/userLogger");
// const getMovesFromCoordinate = require("../positionCalculator");
// const modLogger = require("../Loggers/modLogger");
// const GameManager = require('../GameManager');
// const SocketManager = require("../Socket/SocketManager");
// const GameStateTrackerManager = require("../gameState/GameStateTrackerManager");
//
// module.exports = function (io){
//     io.on('connection', (socket) => {
//
//         const socketManager = new SocketManager(io);
//         const gameManager = new GameManager(io,userLogger,modLogger,socketManager);
//         console.log("socket id in game sockets: " + socket.id);
//         let GameStateTracker = GameStateTrackerManager.getGameStateTracker(socket.room);
//
//         const socketHandlers = {
//             'get_tileInfo': (data) => {
//
//                 //TILE_INFO FOR WHEN 2-6 PLAYERS JOIN
//                 const tileInfo = [
//                     'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
//                     'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
//                     'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
//                     'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
//                     'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
//                     'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
//                     'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
//                     'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
//                     'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
//                 ]
//
//                 //TILE_INFO FOR WHEN 5 PLAYERS JOIN
//                 const tileInfo2 = [
//                     'sales','color1','color5','megatrends','rainbow','color4','chance', 'color2', 'color1', 'sales','rainbow', 'color3','megatrends','color4','color2',
//                     'color3','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
//                     'chance','blank','blank','blank','blank','blank', 'blank', 'color5', 'blank','blank','blank', 'blank', 'blank','blank','color5',
//                     'color5','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank','rainbow',
//                     'rainbow','sales','color2','chance', 'color1','megatrends', 'color4', 'start', 'rainbow', 'sales','color4', 'megatrends', 'color1','color3', 'sales',
//                     'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'color5',
//                     'color4','blank', 'blank', 'blank', 'blank','blank', 'blank', 'color3', 'blank', 'blank','blank','blank','blank','blank','color4',
//                     'color5', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
//                     'sales', 'rainbow', 'color5', 'chance', 'color2','color1', 'megatrends', 'rainbow', 'color5', 'sales','color2','color3', 'chance', 'rainbow', 'color5'
//                 ]
//
//                 socketManager.emitBackToClient(socket,'send_tileInfo', tileInfo);
//                 socketManager.emitBackToClient(socket,'send_tileInfo2', tileInfo2);
//             },
//
//             'roll_dice' : (data) => {
//                 const diceValue = Math.floor(Math.random() * 6) + 1;
//                 socket.emit("set_dice", diceValue)
//             },
//
//             'send_dice_roll_and_position': (data) => {
//                 const coordinate = data.position.split('-');
//                 const xPos = parseInt(coordinate[0]);
//                 const yPos = parseInt(coordinate[1]);
//                 const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);
//                 let formattedPositions = moves.map(pos => `${pos.x}-${pos.y}`);
//                 socket.emit('update_valid_positions', formattedPositions);
//             },
//
//             'start_turn' : (data) => {
//                 gameManager.startRound(socket);
//             },
//
//             'get_pieces': (data) => {
//                 // const room = socket.room;
//                 // let modID;
//                 // switch (data){
//                 //     case 'player':
//                 //         modID = modLogger(room, 'getMod', socket.id, room);
//                 //         break
//                 //     case 'mod':
//                 //         modID = socket.id
//                 //         break
//                 // }
//                 const pieces = GameStateTracker.getStrategies();
//                 console.log("pieces gamesocket: " + pieces);
//                 socketManager.emitToRoom(socket,"add_piece",pieces);
//
//             }
//         }
//         Object.keys(socketHandlers).forEach(event => {
//             socket.on(event, socketHandlers[event])
//         })
//     })
// }
