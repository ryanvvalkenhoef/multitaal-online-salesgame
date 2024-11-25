const JsonFileHandler = require("../jsonFileHandler/JsonFileHandler");
const ModLogger = require("../Loggers/ModLogger");
const UserLogger = require("../Loggers/UserLogger");
const GameStateTrackerManager = require("../gameState/GameStateTrackerManager");
const GameManager = require("../GameManager");
const SocketManager = require("../Socket/SocketManager");

class ModReconnectManager{



    getClassInstances (room,io){
         const jsonFileHandler = new JsonFileHandler(room);
         const modLogger = new ModLogger(room, jsonFileHandler);
         const userLogger = new UserLogger(room, jsonFileHandler);
         const gameStateTracker = new GameStateTrackerManager.getGameStateTracker(room, jsonFileHandler);
         const socketManager = new SocketManager(io);
         const gameManager = new GameManager(userLogger, socketManager, gameStateTracker);

         return {
             jsonFileHandler,
             modLogger,
             userLogger,
             gameStateTracker,
             socketManager,
             gameManager
         }
    }
}

module.exports = ModReconnectManager;