const QuestionQueue = require('./questionQueue');

class ModQuestionQueue extends QuestionQueue {


    constructor() {
        super();

    }


    getQuestionQueueLength(socket, playerId) {
        const room = socket.room;

        if(!this.queues[room]){ // Mod doesn't have a queue so it returns length of 0.
            return 0;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue, so it returns a length of 0
            return 0;
        }

        return this.queues[room][playerId].length;
    }

    addQuestionToQueue(socket, playerId, question) {
        const room = socket.room;

        if (!this.queues[room]) { // Check if mod already has a queue
            this.queues[room] = {};
        }

        if (!this.queues[room][playerId]) { // Initialize player's queue if missing
            this.queues[room][playerId] = [];
        }

        this.queues[room][playerId].push(question); // Add question to player's queue
        return true;
    }

    getQuestionFromQueue(socket, playerId) {
        const room = socket.room;
        if(!this.queues[room]){ // Mod doesn't have a queue
            return null;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue
            return null;
        }
        const question = this.queues[room][playerId].find(question => {
            return question.playerId === playerId;
        });
        if (!question) {
            console.log('No matching question found for playerId:', playerId);
        }
        return question || null;
    }

    removeQuestionFromQueue(socket, playerId){
        const room = socket.room;

        if (!this.queues[room]) {
            return null;
        }
        if (!this.queues[room][playerId]) {
            return null;
        }
        const index = this.queues[room][playerId].findIndex(question => question.playerId === playerId);

        // If a matching question is found, remove it from the queue
        if (index !== -1) {
            this.queues[room][playerId].splice(index, 1);
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