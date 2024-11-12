/**
 * Class responsible for managing instances of the `ModLogger` class, ensuring that each room has only one instance of `ModLogger`.
 *
 * This class uses a static `Map` to store and manage the `ModLogger` instances, with the room identifier as the key. The `getUserLogger`
 * method checks if an instance of `ModLogger` already exists for a given room. If it does not, it creates one and stores it in the map.
 *
 * Methods include:
 * - `getUserLogger(room, jsonFileHandler)`: Retrieves the `ModLogger` instance for the specified room, creating one if necessary.
 *
 *
 * @class ModLoggerManager
 */

const ModLogger = require('./ModLogger');

class ModLoggerManager{
   static #modLoggers = new Map();


    static getModLogger (room,jsonFileHandler){

        if(!this.#modLoggers.has(room)){ // makes modlogger if room doesn't have one
            this.#modLoggers.set(room, new ModLogger(room,jsonFileHandler))
        }

        return this.#modLoggers.get(room);
}


}

module.exports = ModLoggerManager;