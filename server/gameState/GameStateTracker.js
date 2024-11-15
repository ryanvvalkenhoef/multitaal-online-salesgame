/**
 * Class representing the game state for a specific room in the game.
 *
 * This class is responsible for tracking and managing the current state of the game, such as the
 * strategies, player names, rounds, and player count, which are stored in a JSON file. It provides
 * methods for retrieving game data and updating the round. The primary data modification this class
 * handles is the `currentRound` property.
 *
 * Methods include:
 * - `getStrategies`: Retrieves the current game strategies (pieces).
 * - `getRound`: Retrieves the current round and total rounds.
 * - `nextRound`: Increments the round and updates the JSON file.
 * - `checkIfRoundIsFinished`: Checks if the round is finished based on number of players' reviewed.
 * - `checkIfGameOver`: Determines if the game is over based on the round information.
 *
 * @class GameStateTracker
 */

class GameStateTracker {

    #room
    #jsonFileHandler

    constructor(room,jsonFileHandler) {
        this.#room = room;
        this.#jsonFileHandler = jsonFileHandler;
    }

    
    getRoom(){
        return this.#room;
    }


    getStrategies() {  // is also used to get the pieces
        const data = this.#jsonFileHandler.readData()
        return data && data.gameState ? data.gameState.strategies : "No players found";
    }

    getPlayerNames() {
        const data = this.#jsonFileHandler.readData()
        return data ? data.gameState.playerNames : null;
    }

    nextRound(){
        const data = this.#jsonFileHandler.readData()
        if(!data) return null;
        data.gameState.currentRound ++;
        this.#jsonFileHandler.writeData(data);
    }

    getRound() {
        const data = this.#jsonFileHandler.readData()
        return data ? { currentRound: data.gameState.currentRound, totalRounds: data.gameState.totalRounds } : null;
    }


    getPlayerCount() {
        const data = this.#jsonFileHandler.readData()
        return data ? data.gameState.totalPlayers : null;
    }


    getPlayerList() {
        const data = this.#jsonFileHandler.readData()
        return data ? data.users : null;
    }

    checkIfRoundIsFinished() {
        const data = this.#jsonFileHandler.readData()
        return data ? data.gameState.totalPlayers === data.mod.numberOfQuestionsReviewed : null;
    }


    checkIfGameOver = (roundInfo) =>{
        return roundInfo.currentRound === roundInfo.totalRounds;
    }


}

module.exports = GameStateTracker;
