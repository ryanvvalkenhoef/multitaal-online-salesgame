const modLogger = require("./modLogger");

function sendPlayerCount(socket){
  const playerCount = modLogger('getPlayerTotal',socket.id);
  socket.emit('player_count', playerCount);
}




module.exports = {
sendPlayerCount
};