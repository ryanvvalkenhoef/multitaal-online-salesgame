const ModLogger = require('./ModLogger');

class ModLoggerManager{
   static #modLoggers = new Map();

    /**
     * Retrieves the ModLogger for the specified room.
     * If it doesn't exist, a new instance will be created.
     *
     * @param {string} room - The identifier for the game room.
     * @returns {ModLogger} The GameStateTracker instance for the room.
     */
    static getModLogger (room){

        if(!this.#modLoggers.has(room)){ // makes modlogger if room doesn't have one
            this.#modLoggers.set(room, new ModLogger(room))
        }

        return this.#modLoggers.get(room);
}


}

module.exports = ModLoggerManager;