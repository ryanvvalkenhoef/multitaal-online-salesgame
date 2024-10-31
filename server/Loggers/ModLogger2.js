import {readData,writeData}  from '../jsonFileGenerator/readAndWrite'
class ModLogger2 {
    
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


    getMod() {
        const data = readData(this.#room)();
        if (!data) {
            console.log("Can't find mod");
            return null;
        }
        return data.mod;
    }

    deleteMods(modsId) {
        let data = readData(this.#room)();
        if (!data) return;
        data.mod = data.mod.filter((mods) => mods.id !== modsId);
        writeData(data,this.#room);
    }

    addMod(socketid) {
        let data = readData(this.#room)();
        if (!data) return;
        data.mod = {  // creates mod object for json file.
            id: socketid,
            language: "NL",
            room: this.#room,
            numberOfQuestionsReviewed: 0,
            isReviewingQuestion: false,
        }
        writeData(data,this.#room);
    }

    updateMods(modsId, newData) {
        let data = readData(this.#room)();
        if (!data) return;

        const mod = data.mod;
        if (mod && mod.id === modsId) {
            data.mod = { ...mod, ...newData };
            writeData(data,this.#room);
        } else {
            console.error("Mod not found.");
        }
    }

    checkRoom(roomcode) {
        let data = readData(this.#room)();
        if (!data) return null;
        return data.mod.room === roomcode ? "exists" : "does not exist";
    }

    modID() {
        const data = readData(this.#room)();
        return data && data.mod && data.mod.id ? data.mod.id : null;
    }

    addPlayerToMod(socketid, strategy) {
        const data = readData(this.#room)();
        if (!data) return null;

        strategy = this.convertStrategy(strategy);
        data.mod.players_joined.push(strategy);
        writeData(data,this.#room);
        return "added";
    }

    addPlayerNameToMod(socketid, name) {
        const data = readData(this.#room)();
        if (!data) return null;

        data.mod.player_names.push(name);
        writeData(data,this.#room);
        return "added";
    }

    convertStrategy(strategy) {
        switch (strategy) {
            case "top of the world":
                return "world";
            case "jysk telepartner":
                return "jysk";
            case "domino house":
                return "domino";
            default:
                return strategy;
        }
    }

    nextRound() {
        const data = readData(this.#room)();
        if (data && data.mod) {
            data.mod.current_round += 1;
            writeData(data,this.#room);
        }
    }

    getPlayerTurn() {
        const mod = this.getMod();
        return mod ? mod.players_joined : null;
    }

    getPieces() {
        const data = readData(this.#room)();
        return data && data.mod ? data.mod.players_joined : "No players found";
    }

    getPlayerNames() {
        const mod = this.getMod();
        return mod ? mod.player_names : null;
    }

    getRound() {
        const mod = this.getMod();
        return mod ? { currentRound: mod.current_round, totalRounds: mod.total_rounds } : null;
    }

    getPlayerTotal() {
        const mod = this.getMod();
        return mod ? mod.total_players : null;
    }

    checkFull() {
        const mod = this.getMod();
        if (!mod) return null;
        return mod.players_joined.length >= mod.total_players ? "full" : "space";
    }

    removeUserFromMod(info) {
        const data = readData(this.#room)();
        if (!data || !data.mod) return null;

        const { player_names, players_joined } = data.mod;
        const index = player_names.findIndex((name) => name === info.name);
        if (index !== -1) {
            player_names.splice(index, 1);
            players_joined.splice(index, 1);
            writeData(data,this.#room);
        }
    }

    getPlayersList() {
        const data = readData(this.#room)();
        return data ? data.users : null;
    }

    checkIfRoundIsFinished() {
        const data = readData(this.#room)();
        return data ? data.mod.total_players === data.mod.numberOfQuestionsReviewed : null;
    }

    resetRoundStatus() {
        const data = readData(this.#room)();
        if (data && data.mod) {
            data.mod.isRoundFinished = false;
            writeData(data,this.#room);
        }
    }

    getNumberOfQuestionsReviewed() {
        const data = readData(this.#room)();
        return data && data.mod ? data.mod.numberOfQuestionsReviewed : null;
    }

    resetNumberOfQuestionsReviewed() {
        const data = readData(this.#room)();
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed = 0;
            writeData(data,this.#room);
        }
    }

    updateNumberOfQuestionsReviewed() {
        const data = readData(this.#room)();
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed += 1;
            writeData(data,this.#room);
        }
    }

    setIsReviewingQuestion(boolean) {
        const data = readData(this.#room)();
        if (data && data.mod) {
            data.mod.isReviewingQuestion = boolean;
            writeData(data,this.#room);
        }
    }

    checkIfReviewingQuestion() {
        const data = readData(this.#room)();
        return data && data.mod ? data.mod.isReviewingQuestion : null;
    }
}

module.exports = ModLogger2;
