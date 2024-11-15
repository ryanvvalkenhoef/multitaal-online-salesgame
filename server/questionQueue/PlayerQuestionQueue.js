const QuestionQueue = require('./questionQueue');

class PlayerQuestionQueue extends QuestionQueue{

    constructor() {
        super();
    }

    getQuestionQueueLength(socket) {
        const room = socket.room;
        const playerId = socket.id;

        if(!this.queues[room]){ // None of the players have a queue so it returns length of 0
            return 0;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue, so it returns a length of 0
            return 0;
        }

        return this.queues[room][playerId].length;
    }

    addQuestionToQueue(socket,receiverId,question) {
        const room = socket.room;

        if(!this.queues[room]){ // check if rooms already has an object to hold the queues and makes one if not.
            this.queues[room] = {};
        }

        const currentQueue = this.queues[room][receiverId] || [];  // Initialize an empty array (queue) if player's queue is missing
        this.queues[room][receiverId] = [...currentQueue,question];
        return true;
    }

    getQuestionFromQueue(socket) {
        const room = socket.room;
        const playerId = socket.id;

        if(!this.queues[room]){ // None of the players have a queue
            return null;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue
            return null;
        }

        return this.queues[room][playerId][0];
    }

    removeQuestionFromQueue(socket){
        const room = socket.room;
        const playerId = socket.id;
        if (!this.queues[room]) {
            return null;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue
            return null;
        }

        this.queues[room][playerId].shift();
    }



}

module.exports =  PlayerQuestionQueue;