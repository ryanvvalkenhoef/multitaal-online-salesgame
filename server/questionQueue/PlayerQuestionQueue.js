const QuestionQueue = require('./questionQueue');

class PlayerQuestionQueue extends QuestionQueue{

    constructor() {
        super();
    }

    getQuestionQueueLength(socket) {
        const room = socket.room;
        const playerId = socket.id;

        // try{
        //     this.#checkIfRoomExists(room);
        //     this.#checkIfQueueExists(room,playerId)
        // }catch (error){
        //     console.error(error.message)
        //     return null;
        // }
        if(!this.queues[room]){
            this.queues[room] = {};
        }
        if (!this.queues[room][playerId]) {
            console.error(`Room '${room}' doesn't exist in player queue object: can't get queue length`);
            return 0;
        }

        return this.queues[room][playerId].length;
    }

    addQuestionToQueue(socket,receiverId,question) {
        const room = socket.room;
        //const playerId = socket.id;

        // try{
        //     this.#checkIfRoomExists(room);
        // }catch (error){
        //     console.error(error.message);
        //     return null;
        // }
        if(!this.queues[room]){
            this.queues[room] = {};
        }

        const currentQueue = this.queues[room][receiverId] || [];  // Initialize as empty array if player's queue is missing
        this.queues[room][receiverId] = [...currentQueue,question];
        console.log(this.queues[room])
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

    removeQuestionFromQueue(socket){
        const room = socket.room;
        const playerId = socket.id;
        if (!this.queues[room]) {
            console.error(`Room '${room}' doesn't exist in mod queue object: can't remove question from queue`);
            return null;
        }

        this.queues[room][playerId].shift();
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