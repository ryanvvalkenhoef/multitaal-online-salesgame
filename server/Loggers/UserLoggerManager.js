const UserLogger = require('./UserLogger');

class UserLoggerManager{
    static #UserLoggers = new Map();

    /**
     * Retrieves the ModLogger for the specified room.
     * If it doesn't exist, a new instance will be created.
     *
     * @param {string} room - The identifier for the game room.
     * @param {JsonFileHandler} jsonFileHandler - Object reads and writes to jsonfile
     * @returns {UserLogger} The GameStateTracker instance for the room.
     */
    static getModLogger (room, jsonFileHandler){

        if(!this.#UserLoggers.has(room)){ // makes modlogger if room doesn't have one
            this.#UserLoggers.set(room, new UserLogger(room,jsonFileHandler))
        }

        return this.#UserLoggers.get(room);
    }


}

module.exports = UserLoggerManager;