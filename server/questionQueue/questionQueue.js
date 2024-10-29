const modLogger = require("../modLogger");

class QuestionQueue {

  constructor() {
    this.queues = {};
    this.instanceId = Date.now() + Math.random();
    if (new.target === QuestionQueue) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

  }

  #throwError(functionName) {
    throw new Error(`Abstract method ${functionName} must be implemented by subclasses`);
  }

  getQuestionQueueLength(socket) {
    this.#throwError('getQuestionQueueLengh');
  }

  addQuestionToQueue(socket, question) {
    this.#throwError('addQuestionToQueue');

  }

  getQuestionFromQueue(socket) {
    this.#throwError('getQuestionFromQueue');
  }
  removeQuestionFromQueue(socket){
    this.#throwError('getQuestionFromQueue');
  }
}

module.exports = QuestionQueue;

//   getGameData = (room) => {
//     return (gameData = modLogger(room, "readData"));
//   };
//
//
//   getQuestionQueueLenght = (room) => {
//     const gameData = getGameData(room);
//     return (questionQueueLength = gameData.questionQueue.length);
//   };
//
//
//   addQuestionToQueue = (question, room) => {
//     let gameData = getGameData(room);
//
//     if (!gameData) {
//       console.log("Can't read data: addQuestionToQueue()");
//       return null;
//     }
//
//     gameData.questionQueue.push(question);
//     modLogger(room, "writeData", "", gameData);
//   };
//
//
//   getQuestionFromQueue = (room) => {
//     let gameData = getGameData(room);
//     const question = gameData.questionQueue.shift();
//     modLogger(room, 'writeData', '', gameData)
//     return question;
//   };
//
//
// module.exports = {
//   getQuestionQueueLenght,
//   addQuestionToQueue,
//   getQuestionFromQueue,
// };
