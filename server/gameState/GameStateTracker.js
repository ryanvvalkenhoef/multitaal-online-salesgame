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

    resetRoundStatus() {
        const data = this.#jsonFileHandler.readData()
        if (data && data.gameState) {
            data.gameState.isRoundFinished = false;
            this.#jsonFileHandler.writeData(data);
        }
    }

    checkIfGameOver = (roundInfo) =>{
        return roundInfo.currentRound === roundInfo.totalRounds;
    }


}

module.exports = GameStateTracker;
