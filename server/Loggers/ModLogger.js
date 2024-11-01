const { readData,writeData } = require('../jsonFileGenerator/readAndWrite');

class ModLogger {
    
    #room
    
    constructor(room) {
        this.#room = room;
    }


    getRoom(){
        return this.#room;
    }

    getMod() {
        const data = readData(this.#room);
        if (!data) {
            console.log("Can't find mod");
            return null;
        }
        return data.mod;
    }

    deleteMods(modsId) {
        let data = readData(this.#room);
        if (!data) return;
        data.mod = data.mod.filter((mods) => mods.id !== modsId);
        writeData(data,this.#room);
    }

    addMod(socketid) {
        let data = readData(this.#room);
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
        let data = readData(this.#room);
        if (!data) return;

        const mod = data.mod;
        if (mod && mod.id === modsId) {
            data.mod = { ...mod, ...newData };
            writeData(data,this.#room);
        } else {
            console.error("Mod not found.");
        }
    }

    getNumberOfQuestionsReviewed() {
        const data = readData(this.#room);
        return data && data.mod ? data.mod.numberOfQuestionsReviewed : null;
    }

    resetNumberOfQuestionsReviewed() {
        const data = readData(this.#room);
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed = 0;
            writeData(data,this.#room);
        }
    }

    updateNumberOfQuestionsReviewed() {
        const data = readData(this.#room);
        if (data && data.mod) {
            data.mod.numberOfQuestionsReviewed += 1;
            writeData(data,this.#room);
        }
    }

    setIsReviewingQuestion(boolean) {
        const data = readData(this.#room);
        if (data && data.mod) {
            data.mod.isReviewingQuestion = boolean;
            writeData(data,this.#room);
        }
    }

    checkIfReviewingQuestion() {
        const data = readData(this.#room);
        return data && data.mod ? data.mod.isReviewingQuestion : null;
    }
}

module.exports = ModLogger;
