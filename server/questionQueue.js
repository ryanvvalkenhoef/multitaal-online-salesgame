const modLogger = require("./modLogger");

const getGameData = () => {
  return (gameData = modLogger("readData"));
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
  modLogger("writeData", "", gameData);
};

const getQuestionFromQueue = () => {
  let gameData = getGameData();
  const question = gameData.questionQueue.shift();
  modLogger('writeData','',gameData)
  return question;
};

module.exports = {
  getQuestionQueueLenght,
  addQuestionToQueue,
  getQuestionFromQueue,
};
