const QuestionQueue = require('./questionQueue');

class ModQuestionQueue extends QuestionQueue {

    constructor() {
        super();

    }


    getQuestionQueueLenght(socket) {
        const room = socket.room;
        // try{
        //     this.#checkIfRoomExists(room);
        // }catch (error){
        //     console.error(error.message)
        //     return null;
        // }

        if (!this.queues[room]) {
            console.error(`Room '${room}' doesn't exist in mod queue object: can't get queue length`);
            return 0;
        }

        return this.queues[room].length;
    }

    addQuestionToQueue(socket, question) {
        const room = socket.room;
        // try{
        //     this.#checkIfRoomExists(room);
        // }catch (error){
        //     console.error(error.message);
        //     return null;
        // }

        const currentQueue = this.queues[room] || [];  // Initialize as empty array if player's queue is missing
        this.queues[room] = [...currentQueue,question];
        return true;
    }

    getQuestionFromQueue(socket) {
        const room = socket.room;
        //
        // try{
        //     this.#checkIfRoomExists(room);
        //     this.#checkIfQueueIsEmpty(room);
        // }catch (error){
        //     console.error(error.message);
        //     return null;
        // }

        if (!this.queues[room]) {
            console.error(`Room '${room}' doesn't exist in mod queue object: can't get question from queue`);
            return null;
        }
        console.log('get question')
        return this.queues[room][0];
    }

    removeQuestionFromQueue(socket){
        const room = socket.room;
        if (!this.queues[room]) {
            console.error(`Room '${room}' doesn't exist in mod queue object: can't remove question from queue`);
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