const QuestionQueue = require('./questionQueue');

class PlayerQuestionQueue extends QuestionQueue{

    constructor() {
        super();
    }

    getQuestionQueueLength(socket) {
        const room = socket.room;
        const playerId = socket.id;

        if(!this.queues[room]){ // None of the players have a queue so it returns length of 0
            console.log("None of the players have a question queue")
            return 0;
        }
        if (!this.queues[room][playerId]) { // The player doesn't have a queue, so it returns a length of 0
            console.log("The player doesn't have a question que")
            return 0;
        }

        return this.queues[room][playerId].length;
    }

    addQuestionToQueue(socket,receiverId,question) {
        const room = socket.room;

        if(!question){
            console.error("Can't add question to player queue");
            return false;
        }

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

    reconnectToQueue(socket, sessionData){
        const room = socket.room;
        const oldSocketId = sessionData.socketId;
        const newSocketId = socket.id;
        if(this.queues[room] && this.queues[room][oldSocketId]) { //Checks if player has a queue that needs to be reconnected to.
            this.queues[room][newSocketId] = this.queues[room][oldSocketId];
            delete this.queues[room][oldSocketId];
        }

    }



}

module.exports =  PlayerQuestionQueue;