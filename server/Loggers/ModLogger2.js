const fs = require("fs");

class ModLogger2 {
    
    #room
    
    constructor(room) {
        this.#room = room;
    }





    readData() {
        try {
            const data = fs.readFileSync(`gameSaves/${this.#room}data.json`, "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.error("Error reading file:", err);
            return null;
        }
    }

    writeData(jsonData) {
        try {
            fs.writeFileSync(
                `gameSaves/${this.#room}data.json`,
                JSON.stringify(jsonData, null, 2)
            );
        } catch (err) {
            console.error("Error writing to file:", err);
        }
    }

    generateGamepin() {
        const characters = "01234A5S678T9M";
        const length = 5;
        let pin = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pin += characters[randomIndex];
        }
        return pin;
    }

    getRoom(){
        return this.#room;
    }

    setRoom(room){
        this.#room = room;
    }


    getMod() {
        const data = this.readData();
        if (!data) {
            console.log("Can't find mod");
            return null;
        }
        return data.mod;
    }

    deleteMods(modsId) {
        let data = this.readData();
        if (!data) return;
        data.mod = data.mod.filter((mods) => mods.id !== modsId);
        this.writeData(data);
    }

    addMods(mod) {
        let data = this.readData();
        if (!data) return;
        data.mod = mod;
        this.writeData(data);
    }

    updateMods(modsId, newData) {
        let data = this.readData();
        if (!data) return;

        const mod = data.mod;
        if (mod && mod.id === modsId) {
            data.mod = { ...mod, ...newData };
            this.writeData(data);
        } else {
            console.error("Mod not found.");
        }
    }

    checkRoom(roomcode) {
        let data = this.readData();
        if (!data) return null;
        return data.mod.room === roomcode ? "exists" : "does not exist";
    }

    modID() {
        const data = this.readData();
        return data && data.mod && data.mod.id ? data.mod.id : null;
    }

    addPlayerToMod(socketid, strategy) {
        const data = this.readData();
        if (!data) return null;

        strategy = this.convertStrategy(strategy);
        data.mod.players_joined.push(strategy);
        this.writeData(data);
        return "added";
    }

    addPlayerNameToMod(socketid, name) {
        const data = this.readData();
        if (!data) return null;

        data.mod.player_names.push(name);
        this.writeData(data);
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
        const data = this.readData();
        if (data && data.mod) {
            data.mod.current_round += 1;
            this.writeData(data);
        }
    }

    getPlayerTurn() {
        const mod = this.getMod();
        return mod ? mod.players_joined : null;
    }

    getPieces() {
        const data = this.readData();
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
        const data = this.readData();
        if (!data || !data.mod) return null;

        const { player_names, players_joined } = data.mod;
        const index = player_names.findIndex((name) => name === info.name);
        if (index !== -1) {
            player_names.splice(index, 1);
            players_joined.splice(index, 1);
            this.writeData(data);
        }
    }

    getPlayersList() {
        const data = this.readData();
        return data ? data.users : null;
    }

    checkIfRoundIsFinished() {
        const data = this.readData();
        return data ? data.mod.total_players === data.mod.numberOfQuestionsReviewed : null;
    }

    resetRoundStatus() {
        const data = this.readData();
        if (data && data.mod) {
            data.mod.isRoundFinished = false;
            this.writeData(data);
        }
    }

    getNumberOfQuestionsReviewed() {
        const data = this.readData();
        return data && data.mod ? data.mod.numberOfQuestionsReviewed : null;
    }

    resetNumberOfQuestionsReviewed() {
        const data = this.readData();
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed = 0;
            this.writeData(data);
        }
    }

    updateNumberOfQuestionsReviewed() {
        const data = this.readData();
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed += 1;
            this.writeData(data);
        }
    }

    setIsReviewingQuestion(boolean) {
        const data = this.readData();
        if (data && data.mod) {
            data.mod.isReviewingQuestion = boolean;
            this.writeData(data);
        }
    }

    checkIfReviewingQuestion() {
        const data = this.readData();
        return data && data.mod ? data.mod.isReviewingQuestion : null;
    }
}

module.exports = ModLogger2;
