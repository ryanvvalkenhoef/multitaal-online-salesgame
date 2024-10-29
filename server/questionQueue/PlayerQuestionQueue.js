const QuestionQueue = require('./questionQueue');

class PlayerQuestionQueue extends QuestionQueue{

    constructor() {
        super();
    }

    getQuestionQueueLenght(socket) {
        const room = socket.room;
        const playerId = socket.id;

        try{
            this.#checkIfRoomExists(room);
            this.#checkIfQueueExists(room,playerId)
        }catch (error){
            console.error(error.message)
            return null;
        }

        return this.queues[room][playerId].length;
    }

    addQuestionToQueue(socket,question) {
        const room = socket.room;
        const playerId = socket.id;

        try{
            this.#checkIfRoomExists(room);
        }catch (error){
            console.error(error.message);
            return null;
        }

        const currentQueue = this.queues[room][playerId] || [];  // Initialize as empty array if player's queue is missing
        this.queues[room][playerId] = [...currentQueue,question];
        console.log(JSON.stringify(this.queues))
        return true;
    }

    getQuestionFromQueue(socket) {
        const room = socket.room;
        const playerId = socket.id;

        try{
            this.#checkIfRoomExists(room);
            this.#checkIfQueueExists(room,playerId);
            this.#checkIfQueueIsEmpty(room,playerId);
        }catch (error){
            console.error(error.message);
            return null;
        }

        return this.queues[room][playerId][0];
    }

    #checkIfRoomExists(room){
        if(!this.queues[room]){
            throw new Error(`Room '${room}' doesn't exist in player queue object`)
        }
    }
    #checkIfQueueExists(room,playerId){
        if(!this.queues[room][playerId]){
            throw new Error("Player doesn't have a queue")
        }
    }

    #checkIfQueueIsEmpty(room,playerId){
        if(this.queues[room][playerId].length < 1){
            throw new Error("player's queue is empty")
        }
    }

}

module.exports =  PlayerQuestionQueue;