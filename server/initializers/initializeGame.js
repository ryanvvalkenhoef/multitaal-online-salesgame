const JsonFileHandler = require("../jsonFileHandler/JsonFileHandler");
const ModLogger = require("../Loggers/ModLogger");
const UserLogger = require("../Loggers/UserLogger");
const GameStateTrackerManager = require("../gameState/GameStateTrackerManager");
const GameManager = require("../GameManager");
const GameScreenDataEmitter = require("../gameDataEmitters/GameScreenDataEmitter");


const createJsonFileHandler = (room)=>{
    return new JsonFileHandler(room);

}
const createModLogger = (room ,jsonFileHandler)=>{
    return new ModLogger(room, jsonFileHandler);
}

const createUserLogger = (room, jsonFileHandler ) =>{
    return new UserLogger(room,jsonFileHandler);
}

const createGameStateTracker = (room, jsonFileHandler) =>{
    return GameStateTrackerManager.getGameStateTracker(room,jsonFileHandler);
}

const createGameScreenDataEmitter = (userLogger,socketManager, gameStateTracker) =>{
    return new GameScreenDataEmitter(userLogger,socketManager,gameStateTracker)
}

const createGameManager = (room,userLogger, gameStateTracker ,socketManager, gameScreenDataEmitter ) =>{
    return new GameManager(userLogger,socketManager,gameStateTracker, gameScreenDataEmitter);
}

const initializeInstances = (room, socketManager) =>{
    let instances = {};

    instances.jsonFileHandler = createJsonFileHandler(room);
    instances.modLogger = createModLogger(room, instances.jsonFileHandler);
    instances.userLogger = createUserLogger(room, instances.jsonFileHandler);
    instances.gameStateTracker = createGameStateTracker(room,instances.jsonFileHandler);
    instances.gameScreenDataEmitter = createGameScreenDataEmitter(instances.userLogger,socketManager,instances.gameStateTracker)
    instances.gameMananger = createGameManager(room,instances.userLogger,instances.gameStateTracker,socketManager, instances.gameScreenDataEmitter )


    return instances;

}

module.exports = initializeInstances;


