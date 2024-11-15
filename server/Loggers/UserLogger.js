const fs = require('fs');

/**
 * Class representing the players state and management in the game.
 *
 * This class provides methods to interact with and modify player data stored in a JSON file. It includes functionalities
 * for creating, updating, and deleting user records, retrieving specific player properties such as name, points, and strategy,
 * and managing player actions like answering questions and completing turns.
 *
 * The data is stored in a JSON file handled by the provided `JsonFileHandler`. The player data includes properties like
 * `id`, `name`, `room`, `points`, `strategy`, and flags for turn completion and answering questions. The class also
 * manages user-specific game behaviors such as strategy assignments, color associations, and checking if a player is answering
 * a question or has finished their turn.
 *
 * Methods include:
 * - `createUser`: Adds a new player to the JSON file.
 * - `deleteUser`: Removes a player from the JSON file.
 * - `updateUser`: Updates a player's information.
 * - `getUserIDByName`: Retrieves a player's ID by their name.
 * - `getPoints`: Gets a player's points.
 * - `getStrategy`: Returns a player's game strategy.
 * - `getColor`: Retrieves the player's color based on strategy.
 * - `getReceiver`: Determines which player receives a question based on the color.
 * - `resetHasFinishedTurn`: Resets the turn completion flag for all players.
 * - `setIsAnsweringQuestion`: Sets whether a player is answering a question.
 * - `checkIfPlayerIsAnsweringQuestion`: Checks if a player is currently answering a question.
 *
 *
 * @class UserLogger
 */

class UserLogger {
    
    #room;
    #jsonFileHandler;

    constructor(room,jsonFileHandler) {
        this.#room = room;
        this.#jsonFileHandler = jsonFileHandler;
    }
  

    deleteUser(userId) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return;

        data.users = data.users.filter(user => user.id !== userId);

        this.#jsonFileHandler.writeData(data)
    }

    createUser(socketid){
        const data = this.#jsonFileHandler.readData()
        if(!data) return;

        const user = {
            id: socketid,
            language: 'en',
            room: '',
            name: '',
            previousPoints: 0,
            totalPoints: 0,
            strategy:'',
            canRollDice: false,
            isAnsweringQuestion: false,
            hasFinishedTurn: false,
            playerPosition: ''}

        data.users.push(user);
        this.#jsonFileHandler.writeData(data);
    }

     updateUser(userId, newData) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return;

        const index = data.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...newData };
            this.#jsonFileHandler.writeData(data)
        } else {
            console.error('User not found1.');
        }
    }

     getRoom(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === socketid);
        if (user) {
            return user.room;
        } else {
            console.error('User not found2.');
            return null;
        }
    }

     getUserIDByName(name) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.name === name);
        if (user) {
            return user.id;
        } else {
            console.error('User not found!2');
            return null;
        }
    }

     getPoints(id) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === id);
        if (user) {
            return user.totalPoints;
        } else {
            console.error('User not found3.');
            return null;
        }
    }



     getStrategy(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === socketid);
        if (user) {
            let strategy = user.strategy.toLowerCase();
            switch (strategy) {
                case 'top of the world':
                    strategy = 'world';
                    break;
                case 'jysk telepartner':
                    strategy = 'jysk';
                    break;
                case 'domino house':
                    strategy = 'domino';
                    break;
                default:
                    break;
            }
            return strategy;
        } else {
            console.error('User not found5.');
            return null;
        }
    }

    getColor(socketid){
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const players = data.users;
        const player = players.find(player =>{
            return player.id === socketid;
        })

        return player.color;


    }

     getReceiver(questionColor) { // hoort eigenlijk niet in deze class
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const users = data.users;
        for (let user of users) {
            let strategy = user.strategy.toLowerCase();
            let color = '';
            switch (strategy) {
                case 'top of the world':
                    color = 'green';
                    break;
                case 'jysk telepartner':
                    color = 'orange';
                    break;
                case 'domino house':
                    color = 'blue';
                    break;
                case 'lunar':
                    color = 'yellow';
                    break;
                case 'klaphatten':
                    color = 'purple';
                    break;
                case 'safeline':
                    color = 'red';
                    break;
                default:
                    break;
            }

            if (questionColor === color) {
                return user.id;
            }
        }
    }

     getPlayerName(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === socketid);
        if (user) {
            return user.name;
        } else {
            console.error('User not found6.');
            return null;
        }
    }

     getLanguage(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === socketid);
        if (user) {
            return user.language;
        } else {
            console.error('User not found7.');
            return null;
        }
    }
    getCanRollDice(playerId) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const player = data.users.find(player => player.id === playerId);
        return player.canRollDice;
    }

    setCanRollDice(playerId, boolean) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        const player = data.users.find(player => player.id === playerId);
        player.canRollDice = boolean;
        console.log('de bool', boolean);
        this.#jsonFileHandler.writeData(data)
    }

     resetHasFinishedTurn() {
        let data = this.#jsonFileHandler.readData()
        if (!data) return null;

        data.users.forEach(player => (player.hasFinishedTurn = false));
        this.#jsonFileHandler.writeData(data)
    }

     getAllPlayerObjects() {
        let data = this.#jsonFileHandler.readData()
        if (!data) {
            console.log("Can't read data: getAllPlayerObjects()");
            return null;
        }
        return data.users;
    }

     setIsAnsweringQuestion(boolean, socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) {
            console.log("Can't read data: isAnsweringQuestion()");
            return null;
        }

        const player = data.users.find(player => player.id === socketid);
        player.isAnsweringQuestion = boolean;
        this.#jsonFileHandler.writeData(data)
    }

     checkIfPlayerIsAnsweringQuestion(socketid) {
        let data = this.#jsonFileHandler.readData()
        if (!data) {
            console.log("Can't read data: checkIfPlayerIsAnsweringQuestion()");
            return null;
        }

        const player = data.users.find(player => player.id === socketid);
        return player.isAnsweringQuestion;
    }
}

module.exports = UserLogger;
