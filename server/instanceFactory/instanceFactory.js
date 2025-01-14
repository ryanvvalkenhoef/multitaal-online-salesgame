const JsonFileHandler = require("../jsonFileHandler/JsonFileHandler");
const ModLogger = require("../loggers/ModLogger");
const UserLogger = require("../loggers/UserLogger");
const GameStateTrackerManager = require("../gameState/GameStateTrackerManager");
const GameManager = require("../GameManager");
const GameScreenDataEmitter = require("../gameDataEmitters/GameScreenDataEmitter");

const createJsonFileHandler = (room) => {
  return new JsonFileHandler(room);
};
const createModLogger = (room, jsonFileHandler) => {
  return new ModLogger(room, jsonFileHandler);
};

const createUserLogger = (room, jsonFileHandler) => {
  return new UserLogger(room, jsonFileHandler);
};

const createGameStateTracker = (room, jsonFileHandler) => {
  return GameStateTrackerManager.getGameStateTracker(room, jsonFileHandler);
};

const createGameScreenDataEmitter = (
  userLogger,
  socketManager,
  gameStateTracker,
) => {
  return new GameScreenDataEmitter(userLogger, socketManager, gameStateTracker);
};

const createGameManager = (
  userLogger,
  modLogger,
  socketManager,
  gameStateTracker,
  modQuestionQueue,
  gameScreenDataEmitter,
) => {
  return new GameManager(
    userLogger,
    modLogger,
    socketManager,
    gameStateTracker,
    modQuestionQueue,
    gameScreenDataEmitter,
  );
};

/**
 * @module InstanceFactory
 * @description
 * Creates and initializes all core instances required for a game room.
 *
 * This module is as a centralized factory for creating interconnected
 * game-related instances.
 *
 *
 * @param {string} room - Unique identifier for the game room
 * @param {SocketManager} socketManager - Socket management for the room
 * @param {ModQuestionQueue} modQuestionQueue
 *
 * @returns {Object} An object containing all initialized game instances
 *
 * @example
 * const room = 'gameRoom123';
 * const socketManager = new SocketManager();
 * const gameInstances = createInstances(room, socketManager);
 *
 * // Access specific instances
 * const gameManager = gameInstances.gameManager;
 * const userLogger = gameInstances.userLogger;
 */

const createInstances = (room, socketManager, modQuestionQueue) => {
  let instances = {};

  instances.jsonFileHandler = createJsonFileHandler(room);
  instances.modLogger = createModLogger(room, instances.jsonFileHandler);
  instances.userLogger = createUserLogger(room, instances.jsonFileHandler);
  instances.gameStateTracker = createGameStateTracker(
    room,
    instances.jsonFileHandler,
  );
  instances.gameScreenDataEmitter = createGameScreenDataEmitter(
    instances.userLogger,
    socketManager,
    instances.gameStateTracker,
  );
  instances.gameManager = createGameManager(
    instances.userLogger,
    instances.modLogger,
    socketManager,
    instances.gameStateTracker,
    modQuestionQueue,
    instances.gameScreenDataEmitter,
  );

  return instances;
};

module.exports = createInstances;
