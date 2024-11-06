const fs = require('fs');

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
            points: 0,
            strategy:'',
            isAnsweringQuestion: false,
            hasFinishedTurn: false,
            playerPosition: '' }

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
            return user.points;
        } else {
            console.error('User not found3.');
            return null;
        }
    }

     availability(socketid, userName, userRoom, userStrat) {
        let data = this.#jsonFileHandler.readData()
        if (!data) return 'available';

        for (let user of data.users) {
            if (user.name === userName && user.room === userRoom) {
                return 'Name already in use';
            }
            if (user.strategy === userStrat && user.room === userRoom) {
                return 'Strategy already in use';
            }
        }
        return 'available';
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

     getReceiver(questionColor) {
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
