class ModLogger {
    
    #room;
    #jsonFileHandler;
    
    constructor(room,jsonFileHandler) {
        this.#room = room;
        this.#jsonFileHandler = jsonFileHandler;
    }


    getRoom(){
        return this.#room;
    }

    getMod() {
        const data = this.#jsonFileHandler.readData()
        if (!data) {
            console.log("Can't find mod");
            return null;
        }
        return data.mod;
    }

    deleteMod(modsId) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return;
        data.mod = data.mod.filter((mods) => mods.id !== modsId);
        this.#jsonFileHandler.writeData(data);
    }

    createMod(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return;

        const gameHasMod = Object.keys(data.mod).length > 0; //checks if mod object in json file is empty;
        console.log("boolean: " + gameHasMod)
        if(gameHasMod){
            console.log("Game already has a moderator assigned");
            return null;
        }

        data.mod = {  // creates mod object for json file.
            id: socketid,
            language: "NL",
            room: this.#room,
            numberOfQuestionsReviewed: 0,
            isReviewingQuestion: false,
        }
        this.#jsonFileHandler.writeData(data);
    }

    updateMod(modsId, newData) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return;

        const mod = data.mod;
        if (mod && mod.id === modsId) {
            data.mod = { ...mod, ...newData };
            this.#jsonFileHandler.writeData(data);
        } else {
            console.error("Mod not found.");
        }
    }

    resetNumberOfQuestionsReviewed() {
        const data = this.#jsonFileHandler.readData()
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed = 0;
            this.#jsonFileHandler.writeData(data);
        }
    }

    updateNumberOfQuestionsReviewed() {
        const data = this.#jsonFileHandler.readData()
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed += 1;
            this.#jsonFileHandler.writeData(data);
        }
    }

    setIsReviewingQuestion(boolean) {
        const data = this.#jsonFileHandler.readData()
        if (data && data.mod) {
            data.mod.isReviewingQuestion = boolean;
            this.#jsonFileHandler.writeData(data);
        }
    }

    checkIfReviewingQuestion() {
        const data = this.#jsonFileHandler.readData()
        return data && data.mod ? data.mod.isReviewingQuestion : null;
    }
}

module.exports = ModLogger;
