const modLogger = require("./modLogger");

const getGameData = () => {
  return (gameData = modLogger(socket.room, "readData"));
};

const getQuestionQueueLenght = () => {
  const gameData = getGameData();
  return (questionQueueLength = gameData.questionQueue.length);
};

const addQuestionToQueue = (question) => {
  let gameData = getGameData();

  if (!gameData) {
    console.log("Can't read data: addQuestionToQueue()");
    return null;
  }
  
  gameData.questionQueue.push(question);
  modLogger(socket.room, "writeData", "", gameData);
};

const getQuestionFromQueue = () => {
  let gameData = getGameData();
  const question = gameData.questionQueue.shift();
  modLogger(socket.room, 'writeData','',gameData)
  return question;
};

module.exports = {
  getQuestionQueueLenght,
  addQuestionToQueue,
  getQuestionFromQueue,
};
