/**
 * Class responsible for managing the game configuration and pre-game setup.
 *
 * This class provides static methods for setting game parameters such as total players, total rounds, player strategies, and player names
 * that are being stored in the gameState object in the JSON file.
 * It also handles checking if a room is full, and validating room availability.
 *
 * Methods include:
 * - `setTotalPlayers(totalPlayers, jsonFileHandler)`: Sets the total number of players for the game.
 * - `setTotalRounds(totalRounds, jsonFileHandler)`: Sets the total number of rounds for the game.
 * - `addStrategy(strategy, jsonFileHandler)`: Adds a strategy.
 * - `addPlayerName(playerName, jsonFileHandler)`: Adds a player name.
 * - `getColor(socketid, jsonFileHandler)`: Returns the color a player should get based on their strategy.
 * - `checkIfRoomFull(jsonFileHandler)`: Checks if the room is full by comparing the number of strategies to the total number of players.
 * - `checkIfValidRoom(room, roomList)`: Checks if a room is valid by matching it against a list of available rooms.
 *
 * @class PreGameManager
 */

class PreGameManager {
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

  static getColor(socketid, jsonFileHandler) {
    // returns the color a player should get based on their strategy
    let data = jsonFileHandler.readData();
    if (!data) return null;

    const user = data.users.find((user) => user.id === socketid);
    if (user) {
      const strategy = user.strategy.toLowerCase();
      let color = "";
      switch (strategy) {
        case "top of the world":
          color = "green";
          break;
        case "jysk telepartner":
          color = "orange";
          break;
        case "domino house":
          color = "blue";
          break;
        case "lunar":
          color = "yellow";
          break;
        case "klaphatten":
          color = "purple";
          break;
        case "safeline":
          color = "red";
          break;
        default:
          break;
      }
      return color;
    } else {
      console.error("User not found5.");
      return null;
    }
  }

  static checkIfRoomFull(jsonFileHandler) {
    const data = jsonFileHandler.readData();
    if (!data) return null;
    return data.gameState.strategies.length >= data.gameState.totalPlayers;
  }

  static checkIfValidRoom(room, roomList) {
    return roomList.includes(room);
  }

  static checkIfUniqueName(jsonFileHandler, newName) {
    const data = jsonFileHandler.readData();
    if (!data) return null;

    for (const name of data.gameState.playerNames) {
      if (name.toLowerCase() === newName.toLowerCase()) {
        return false;
      }
    }

    return true;
  }

  static checkIfUniqueStrategy(jsonFileHandler, newName) {
    const data = jsonFileHandler.readData();
    if (!data) return null;

    for (const name of data.gameState.strategies) {
      if (name.toLowerCase() === newName.toLowerCase()) {
        return false;
      }
    }

    return true;
  }
}
module.exports = PreGameManager;
