const modLogger = require("./modLogger");
const userLogger = require("./userLogger");

function sendPlayerCount(socket) {
  const playerCount = modLogger(socket.room, "getPlayerTotal", socket.id);
  socket.emit("player_count", playerCount);
}

const sendAnswerToModerator = (io, questionData) => {
  io.to("mod").emit("receive_player_answer", questionData);
};



const updateGameState = (io,socket) => {
  modLogger(socket.room, "nextRound", socket.id);
  io.to("players").emit("submitted_points");
  const roundInfo = modLogger(socket.room, "getRound", socket.id);
  io.emit("rounds", roundInfo);
  userData = userLogger(socket.room, "getData", socket.id);
  io.emit("data_leaderboard", userData);
}

const startRound = (socket)=>{
  console.log("Start round");
  
  const strategies = modLogger(socket.room, "getPlayerTurn", socket.id); //is een array
  const playersList = modLogger(socket.room, "getPlayersList");
  sendPlayerCount(socket);

  for(let i = 0; i < playersList.length; i++){

    const socketId = playersList[i].id;
    const strategy = strategies[i];
    const name = playersList[i].name;

    socket.to(socketId).emit('players_turn',strategy);
    socket.to(socketId).emit('players_name', name) // heeft te maken met knipperen van naam op leaderbord en turn text
                            
}
}
module.exports = {
 sendPlayerCount,
 sendAnswerToModerator,
 updateGameState,
 startRound 


};
