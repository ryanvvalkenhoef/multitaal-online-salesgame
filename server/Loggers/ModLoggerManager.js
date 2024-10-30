const ModLogger2 = require('./ModLogger2');

class ModLoggerManager{
    #modLoggers
    constructor() {
        this.#modLoggers = new Map();
    }

    getModLogger (room){

        if(!this.#modLoggers.has(room)){
            this.#modLoggers.set(room, new ModLogger2(room))
        }

        return this.#modLoggers.get(room);
}
}

export default ModLoggerManager;