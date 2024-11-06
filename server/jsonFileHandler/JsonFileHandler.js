const fs = require("fs");

class JsonFileHandler {

    #room
    #path
    constructor(room) {
        this.#room = room;
        this.#path = `gameSaves/${this.#room}data.json`;
    }

    createJsonFile(){

       if(fs.existsSync(this.#path)){
           console.log(`JSON file for room ${this.#room} already exists`);
       }
       else {
           const gameStateObject = {
               totalPlayers: 0,
               totalRounds: 0,
               currentRound: 1,
               strategies: [],
               playerNames: [],
           }

           const jsonFile = {
               users: [],
               mod: {},
               gameState: gameStateObject
           }

           fs.writeFileSync(this.#path, JSON.stringify(jsonFile), null, 2);
       }
    }

    readData  () {
        try {
            const data = fs.readFileSync(this.#path,"utf8");
            return JSON.parse(data);
        } catch (err) {
            console.error("Error reading file:", err);
            return null;
        }
    }


    writeData (jsonData) {
        try {
            fs.writeFileSync(this.#path,JSON.stringify(jsonData, null, 2)
            );
        } catch (err) {
            console.error("Error writing to file:", err);
        }
    }


}
module.exports = JsonFileHandler;

