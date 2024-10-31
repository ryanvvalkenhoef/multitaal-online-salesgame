
import {readData,writeData}  from '../jsonFileGenerator/readAndWrite'

class GameStateTracker {

    #room

    constructor(room) {
        this.#room = room;
    }

    
    getRoom(){
        return this.#room;
    }

    setRoom(room){
        this.#room = room;
    }



    // checkRoom(roomcode) {
    //     let data = readData(this.#room);
    //     if (!data) return null;
    //     return data.gameState.room === roomcode ? "exists" : "does not exist";
    // }



    getStrategies() {  // is also used to get the pieces
        const data = readData(this.#room);
        return data && data.gameState ? data.gameState.strategies : "No players found";
    }

    getPlayerNames() {
        const data = readData(this.#room);
        return data ? data.player_names : null;
    }

    nextRound(){
        const data = readData(this.#room);
        if(!data) return null;
        data.gameState.currentRound ++;
        writeData(data,this.#room);
    }

    getRound() {
        const data = readData(this.#room);
        return data ? { currentRound: data.currentRound, totalRounds: data.totalRounds } : null;
    }


    getPlayerTotal() {
        const data = readData(this.#room);
        return data ? data.totalPlayers : null;
    }


    getPlayersList() {
        const data = readData(this.#room);
        return data ? data.users : null;
    }

    checkIfRoundIsFinished() {
        const data = readData(this.#room);
        return data ? data.gameState.totalPlayers === data.gameState.numberOfQuestionsReviewed : null;
    }

    resetRoundStatus() {
        const data = readData(this.#room);
        if (data && data.gameState) {
            data.gameState.isRoundFinished = false;
            writeData(data,this.#room);
        }
    }


}

module.exports = GameStateTracker;
