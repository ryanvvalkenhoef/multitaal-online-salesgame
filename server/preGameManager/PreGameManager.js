class PreGameManager {  //This class sets the game configuration


    static setTotalPlayers(totalPlayers, jsonFileHandler) {
        const data = jsonFileHandler.readData();
        if (!data) return null;
        if (!totalPlayers) {
            console.warn("total players is: " + totalPlayers);
            return null;
        }
        data.gameState.totalPlayers = totalPlayers;
        jsonFileHandler.writeData(data);
    }

    static setTotalRounds(totalRounds, jsonFileHandler) {
        const data = jsonFileHandler.readData();
        if (!data) return null;
        if (!totalRounds) {
            console.warn("total rounds is: " + totalRounds);
            return null;
        }
        data.gameState.totalRounds = totalRounds;
        jsonFileHandler.writeData(data);
    }

    static addStrategy(strategy, jsonFileHandler) {
        switch (strategy) {
            case "top of the world":
                strategy = "world";
                break;
            case "jysk telepartner":
                strategy = "jysk";
                break;
            case "domino house":
                strategy = "domino";
                break;
            default:
                strategy = strategy;
                break;
        }
        const data = jsonFileHandler.readData();
        if (!data) return null;
        data.gameState.strategies.push(strategy);
        jsonFileHandler.writeData(data);

    }

    static addPlayerName(playerName, jsonFileHandler) {
        const data = jsonFileHandler.readData();
        if (!data) return null;
        data.gameState.playerNames.push(playerName);
        jsonFileHandler.writeData(data);

    }
    
    static getColor(socketid,jsonFileHandler){ // returns the color a player should get based on their strategy
        let data = jsonFileHandler.readData()
        if (!data) return null;

        const user = data.users.find(user => user.id === socketid);
        if (user) {
            const strategy = user.strategy.toLowerCase();
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
            return color;
        } else {
            console.error('User not found5.');
            return null;
        }
    }

    static checkIfRoomFull(jsonFileHandler) {
        const data = jsonFileHandler.readData();
        if (!data) return null;
        return data.gameState.strategies.length >= data.gameState.totalPlayers;
    }

    static checkIfValidRoom(room, roomList) {
        return roomList.includes(room)
    }
}
module.exports = PreGameManager;