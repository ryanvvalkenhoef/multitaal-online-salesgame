const modLogger = require("./modLogger");

const getGameData = (room) => {
  return (gameData = modLogger(room, "readData"));
};

const getQuestionQueueLenght = (room) => {
  const gameData = getGameData(room);
  return (questionQueueLength = gameData.questionQueue.length);
};

const addQuestionToQueue = (question,room) => {
  let gameData = getGameData(room);

  if (!gameData) {
    console.log("Can't read data: addQuestionToQueue()");
    return null;
  }
  
  gameData.questionQueue.push(question);
  modLogger(room, "writeData", "", gameData);
};

const getQuestionFromQueue = (room) => {
  let gameData = getGameData(room);
  const question = gameData.questionQueue.shift();
  modLogger(room, 'writeData','',gameData)
  return question;
};

module.exports = {
  getQuestionQueueLenght,
  addQuestionToQueue,
  getQuestionFromQueue,
};
