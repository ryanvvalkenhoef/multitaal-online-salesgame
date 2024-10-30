const QuestionQueue = require('./questionQueue');

class ModQuestionQueue extends QuestionQueue {

    constructor() {
        super();

    }


    getQuestionQueueLength(socket) {
        const room = socket.room;

        if(!this.queues[room]){ // Mod doesn't have a queue so it returns length of 0.
            return 0;
        }

        return this.queues[room].length;
    }

    addQuestionToQueue(socket, question) {
        const room = socket.room;

        if(!this.queues[room]){ // check if mod already has an object to hold the queues and makes one if not.
            this.queues[room] = {};
        }

        const currentQueue = this.queues[room] || [];  // Initialize as empty array if player's queue is missing
        this.queues[room] = [...currentQueue,question];
        return true;
    }

    getQuestionFromQueue(socket) {
        const room = socket.room;

        if(!this.queues[room]){ // Mod doesn't have a queue
            return null;
        }

        return this.queues[room][0];
    }

    removeQuestionFromQueue(socket){
        const room = socket.room;

        if (!this.queues[room]) {
            return null;
        }

        this.queues[room].shift();
    }

    #checkIfRoomExists(room) {
        if (!this.queues[room]) {
            throw new Error(`Room '${room}' doesn't exist in mod queue object`)
        }
    }



    #checkIfQueueIsEmpty(room) {
        if (this.queues[room].length < 1) {
            throw new Error("player's queue is empty")
        }
    }
}

module.exports = ModQuestionQueue;