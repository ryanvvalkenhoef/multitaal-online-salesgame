const modLogger = require("./modLogger");

function sendPlayerCount(socket) {
  const playerCount = modLogger("getPlayerTotal", socket.id);
  socket.emit("player_count", playerCount);
}

const sendAnswerToModerator = (socket, questionData) => {
  socket.to("mod").emit("receive_player_answer", questionData);
};

module.exports = {
  sendPlayerCount,
};
