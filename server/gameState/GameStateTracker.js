
const {readData,writeData}  = require('../jsonFileGenerator/readAndWrite')

class GameStateTracker {

    #room

    constructor(room) {
        this.#room = room;
    }

    
    getRoom(){
        return this.#room;
    }


    getStrategies() {  // is also used to get the pieces
        const data = readData(this.#room);
        return data && data.gameState ? data.gameState.strategies : "No players found";
    }

    getPlayerNames() {
        const data = readData(this.#room);
        return data ? data.gameState.playerNames : null;
    }

    nextRound(){
        const data = readData(this.#room);
        if(!data) return null;
        data.gameState.currentRound ++;
        writeData(data,this.#room);
    }

    getRound() {
        const data = readData(this.#room);
        return data ? { currentRound: data.gameState.currentRound, totalRounds: data.gameState.totalRounds } : null;
    }


    getPlayerCount() {
        const data = readData(this.#room);
        return data ? data.gameState.totalPlayers : null;
    }


    getPlayersList() {
        const data = readData(this.#room);
        return data ? data.users : null;
    }

    checkIfRoundIsFinished() {
        const data = readData(this.#room);
        return data ? data.gameState.totalPlayers === data.mod.numberOfQuestionsReviewed : null;
    }

    resetRoundStatus() {
        const data = readData(this.#room);
        if (data && data.gameState) {
            data.gameState.isRoundFinished = false;
            writeData(data,this.#room);
        }
    }

    checkIfGameOver = (roundInfo) =>{
        return roundInfo.currentRound === roundInfo.totalRounds;
    }


}

module.exports = GameStateTracker;
