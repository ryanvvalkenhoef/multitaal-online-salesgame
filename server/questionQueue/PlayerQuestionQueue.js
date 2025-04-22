const QuestionQueue = require("./questionQueue");
const CRUDUtils = require("../utils/CRUDUtils");

class PlayerQuestionQueue extends QuestionQueue {
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
      const room = socket.room;
      const playerId = socket.id;
  
      if (this.handleErrors(queue = this.queues[room])) {
        return 0;
      }
      if (this.handleErrors(queue = this.queues[room][playerId])) {
        return 0;    
      }

      return this.queues[room][playerId].length;

    } else { /* getQuestionFromQueue */
      const room = socket.room;
      const playerId = socket.id;

      if (this.handleErrors(queue = this.queues[room])) return null;
      if (this.handleErrors(queue = this.queues[room][playerId])) return null;

      return this.queues[room][playerId][0];
    }
  }

  create = (socket, receiverId, question) => { /* addQuestionToQueue */
    const room = socket.room;

    if (this.handleErrors(question = question)) {
      return false;
    }
    // Check if rooms already has an object to hold the queues and makes one if not.
    if (this.handleErrors(queue = this.queues[room])) this.queues[room] = {};

    const currentQueue = this.queues[room][receiverId] || []; // Initialize an empty array (queue) if player's queue is missing
    this.queues[room][receiverId] = [...currentQueue, question];
    return true;
  }

  delete = (socket) => { /* deleteQuestionFromQueue */
    const room = socket.room;
    const playerId = socket.id;

    if (this.handleErrors(queue = this.queues[room])) {
      return null;
    }
    if (this.handleErrors(queue = this.queues[room][playerId])) {
      return null;
    }

    this.queues[room][playerId].shift();
  }

  update = (socket, sessionData) => { /* reconnectToQueue */
    const room = socket.room;
    const oldSocketId = sessionData.socketId;
    const newSocketId = socket.id;

    if (this.handleErrors(queue = this.queues[room])
      && this.handleErrors(queue = this.queues[room][oldSocketId])) {
        // Checks if player has a queue that needs to be reconnected to.
        this.queues[room][newSocketId] = this.queues[room][oldSocketId];
        delete this.queues[room][oldSocketId];
    }
  }

  handleErrors(queue = null, question = null) {
    switch (true) {
      case !!queue:
        console.log("Player(s) do not have a question queue")
        return true;
      case !!question:
        console.error("Can't add question to player queue");
        return true;
      default:
        return false;
    }
  }
}

module.exports = PlayerQuestionQueue;
