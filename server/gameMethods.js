const modLogger = require("./modLogger");
const userLogger = require("./userLogger");

function sendPlayerCount(socket) {
  const playerCount = modLogger("getPlayerTotal", socket.id);
  socket.emit("player_count", playerCount);
}

const sendAnswerToModerator = (io, questionData) => {
  io.to("mod").emit("receive_player_answer", questionData);
};



const updateGameState = (io,socket) => {
  modLogger("nextRound", socket.id);
  io.to("players").emit("submitted_points");
  const roundInfo = modLogger("getRound", socket.id);
  io.emit("rounds", roundInfo);
  userData = userLogger("getData", socket.id);
  console.log("punten speler 1:" + userData[0].points);
  console.log("punten speler 2:" + userData[1].points);
  

  
  io.emit("data_leaderboard", userData);
}

const startRound = (io,socket)=>{
  console.log("Start round");
  
  const strategies = modLogger("getPlayerTurn", socket.id); 
  const playersList = modLogger("getPlayersList");
  sendPlayerCount(socket);

  for(let i = 0; i < playersList.length; i++){

    const socketId = playersList[i].id;
    const strategy = strategies[i];
    const name = playersList[i].name;

    io.to(socketId).emit('players_turn',strategy);
    io.to(socketId).emit('players_name', name) // heeft te maken met knipperen van naam op leaderbord en turn text
                            
}
}


const updateAllBoards = (io) =>{
  const players = userLogger('getAllPlayers');
  const playerPositions = players.map(player => player.playerPosition);
  io.emit('update_position',playerPositions);
}

module.exports = {
 sendPlayerCount,
 sendAnswerToModerator,
 updateGameState,
 startRound,
 updateAllBoards 


};
