const GamesStateTracker = require("../gameState/GameStateTracker");

class GameStateTrackerManager{

    static #gameStateTrackers
    constructor() {
        this.#gameStateTrackers = new Map();
    }

    static getGameStateTracker (room){

        if(!this.#gameStateTrackers.has(room)){ // makes gameStateTracker if room doesn't have one
            this.#gameStateTrackers.set(room, new GamesStateTracker(room))
        }

        return this.#gameStateTrackers.get(room);
    }
}

export default  GameStateTrackerManager;