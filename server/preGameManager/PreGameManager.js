const {readData,writeData}  = require('../jsonFileGenerator/readAndWrite')

class PreGameManager {  //This class sets the game configuration


    static setTotalPlayers(totalPlayers, room) {
        const data = readData(room);
        if (!data) return null;
        if (!totalPlayers) {
            console.warn("total players is: " + totalPlayers);
            return null;
        }
        data.gameState.totalPlayers = totalPlayers;
        writeData(data, room);
    }

    static setTotalRounds(totalRounds, room) {
        const data = readData(room);
        if (!data) return null;
        if (!totalRounds) {
            console.warn("total rounds is: " + totalRounds);
            return null;
        }
        data.gameState.totalRounds = totalRounds;
        writeData(data, room);
    }

    static addStrategy(strategy, room) {
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
        const data = readData(room);
        if (!data) return null;
        data.gameState.strategies.push(strategy);
        writeData(data, room);

    }

    static addPlayerName(playerName, room) {
        const data = readData(room);
        if (!data) return null;
        data.gameState.playerNames.push(playerName);
        writeData(data, room);

    }

    static checkIfRoomFull(room) {
        const data = readData(room);
        if (!data) return null;
        return data.gameState.strategies.length >= data.gameState.totalPlayers ? "full" : "space";
    }

    static checkIfValidRoom(room, roomList) {
        const validRoom = roomList.includes(room)
        return validRoom ? true : false;
    }
}
module.exports = PreGameManager;