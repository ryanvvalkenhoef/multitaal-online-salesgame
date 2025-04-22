const QuestionQueue = require("./questionQueue");
const CRUDUtils = require("../utils/CRUDUtils");

class ModQuestionQueue extends QuestionQueue {
  constructor() {
    super();
    const { create, read, update, delete: del } = CRUDUtils;
    this.create = create;
    this.read = read;
    this.update = update;
    this.delete = del;
  }

  read = (socket, wantsLength) => {
    if (wantsLength) { /* getQuestionQueueLength */
      if (this.handleErrors(queue = this.queues[room])) {
        return 0
      };
      if (this.handleErrors(queue = this.queues[room][playerId])) { 
        return 0;
      }

      return this.queues[room][playerId].length;
    } else { /* getQuestionFromQueue */
      if (this.handleErrors(queue = this.queues[room])) return null;
      if (this.handleErrors(queue = this.queues[room][playerId])) return null;
      
      const question = this.queues[room][playerId].find((question) => {
        if (this.handleErrors(question = question)) {
          return question.playerId === playerId;
        }
      });
      return question || null;
    }
  }

  create = (socket, question) => { /* addQuestionToQueue */
    const room = socket.room;
    const playerId = socket.id;

    if (this.handleErrors(queue = this.queues[room])) {
      this.queues[room] = {};
    }
    if (this.handleErrors(queue = this.queues[room][playerId])) {
      this.queues[room][playerId] = [];
    }

    this.queues[room][playerId].push(question); // Add question to player's queue
    return true;
  }

  delete = (socket) => { /* deleteQuestionFromQueue */
    const room = socket.room;
    const playerId = socket.id;

    if (this.handleErrors(queue = this.queues[room])) return null;
    if (this.handleErrors(queue = this.queues[room][playerId])) return null;

    const index = this.queues[room][playerId].findIndex(
      (question) => question.playerId === playerId,
    );

    // If a matching question is found, remove it from the queue
    if (index !== -1) {
      this.queues[room][playerId].splice(index, 1);
    }
  }

  #checkIfRoomExists(room) {
    if (!this.queues[room]) {
      throw new Error(`Room '${room}' doesn't exist in mod queue object`);
    }
  }

  #checkIfQueueIsEmpty(room) {
    if (this.queues[room].length < 1) {
      throw new Error("player's queue is empty");
    }
  }

  handleErrors(queue = null, question = null) {
    switch (true) {
      case !!queue:
        console.log("Player(s) do not have a question queue")
        return true;
      case !!question:
        console.error("Can't get question");
        return true;
      default:
        return false;
    }
  }
}

module.exports = ModQuestionQueue;
