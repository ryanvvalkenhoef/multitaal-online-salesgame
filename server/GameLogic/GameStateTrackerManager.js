const GamesStateTracker = require("../gameState/GameStateTracker");

class GameStateTrackerManager {
  static #gameStateTrackers = new Map();

  /**
   * Retrieves the GameStateTracker for the specified room.
   * If it doesn't exist, a new instance will be created.
   *
   * @param {string} room - The identifier for the game room.
   * @param {JsonFileHandler} jsonFileHandler - Object reads and writes to jsonfile
   * @returns {GameStateTracker} The GameStateTracker instance for the room.
   */
  static getGameStateTracker(room, jsonFileHandler) {
    if (!this.#gameStateTrackers.has(room)) {
      // makes gameStateTracker if room doesn't have one
      this.#gameStateTrackers.set(
        room,
        new GamesStateTracker(room, jsonFileHandler),
      );
    }

    return this.#gameStateTrackers.get(room);
  }
}

module.exports = GameStateTrackerManager;
