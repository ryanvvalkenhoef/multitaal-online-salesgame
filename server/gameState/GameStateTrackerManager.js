const GamesStateTracker = require("../gameState/GameStateTracker");

class GameStateTrackerManager{

    static #gameStateTrackers
    constructor() {
        this.#gameStateTrackers = new Map();
    }

    /**
     * Retrieves the GameStateTracker for the specified room.
     * If it doesn't exist, a new instance will be created.
     *
     * @param {string} room - The identifier for the game room.
     * @returns {GameStateTracker} The GameStateTracker instance for the room.
     */
    static getGameStateTracker (room){

        if(!this.#gameStateTrackers.has(room)){ // makes gameStateTracker if room doesn't have one
            this.#gameStateTrackers.set(room, new GamesStateTracker(room))
        }

        return this.#gameStateTrackers.get(room);
    }
}

export default  GameStateTrackerManager;