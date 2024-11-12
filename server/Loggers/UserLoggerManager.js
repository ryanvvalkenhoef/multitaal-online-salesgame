/**
 * Class responsible for managing instances of the `UserLogger` class, ensuring that each room has only one instance of `UserLogger`.
 *
 * This class uses a static `Map` to store and manage the `UserLogger` instances, with the room identifier as the key. The `getUserLogger`
 * method checks if an instance of `UserLogger` already exists for a given room. If it does not, it creates one and stores it in the map.
 *
 * Methods include:
 * - `getUserLogger(room, jsonFileHandler)`: Retrieves the `UserLogger` instance for the specified room, creating one if necessary.
 *
 *
 * @class UserLoggerManager
 */

const UserLogger = require('./UserLogger');

class UserLoggerManager{
    static #UserLoggers = new Map();

    static getUserLogger (room, jsonFileHandler){

        if(!this.#UserLoggers.has(room)){ // makes modlogger if room doesn't have one
            this.#UserLoggers.set(room, new UserLogger(room,jsonFileHandler))
        }

        return this.#UserLoggers.get(room);
    }


}

module.exports = UserLoggerManager;