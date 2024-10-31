const ModLogger2 = require('./ModLogger2');

class ModLoggerManager{
   static #modLoggers
    constructor() {
        this.#modLoggers = new Map();
    }

   static getModLogger (room){

        if(!this.#modLoggers.has(room)){ // makes modlogger if room doesn't have one
            this.#modLoggers.set(room, new ModLogger2(room))
        }

        return this.#modLoggers.get(room);
}
}

export default ModLoggerManager;