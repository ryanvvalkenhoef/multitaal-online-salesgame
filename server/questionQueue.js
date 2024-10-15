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

  gameData.mods[0].questionQueue.push(question);
  modLogger("writeData", "", gameData);
};

const getQuestionFromQueue = () => {
  let gameData = getGameData();
  return gameData.questionQueue.shift();
};

module.exports = {
  getQuestionQueueLenght,
  addQuestionToQueue,
  getQuestionFromQueue,
};
