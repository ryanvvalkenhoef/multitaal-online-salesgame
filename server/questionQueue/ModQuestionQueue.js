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

        if(!this.queues[room]){ // check if mod already has a queue
            this.queues[room] = [];
        }

        const currentQueue = this.queues[room];  // Initialize as empty array if player's queue is missing
        this.queues[room] = [...currentQueue,question];
        return true;
    }

    getQuestionFromQueue(socket, playerId) {
        const room = socket.room;
        console.log('playerId:', playerId);
        if(!this.queues[room]){ // Mod doesn't have a queue
            return null;
        }
        const question = this.queues[room].find(question => {
            console.log('Checking question.playerId:', question.playerId);
            return question.playerId === playerId;
        });
        if (!question) {
            console.log('No matching question found for playerId:', playerId);
        }

        console.log('Found question:', question);

        return question || null;
    }

    removeQuestionFromQueue(socket, playerId){
        const room = socket.room;

        if (!this.queues[room]) {
            return null;
        }
        const index = this.queues[room].findIndex(question => question.playerId === playerId);

        // If a matching question is found, remove it from the queue
        if (index !== -1) {
            this.queues[room].splice(index, 1);
        }
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