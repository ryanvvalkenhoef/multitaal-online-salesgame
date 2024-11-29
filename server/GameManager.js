class GameManager{
  
  #userLogger
  #modLogger
  #socketManager
  #gameStateTracker
  #modQuestionQueue
  
  constructor(userLogger, modLogger, socketManager, gameStateTracker, modQuestionQueue) {
    this.#userLogger = userLogger;
    this.#modLogger = modLogger;
    this.#socketManager = socketManager
    this.#gameStateTracker = gameStateTracker;
    this.#modQuestionQueue = modQuestionQueue;
  }


  sendPlayerCount(socket) {
      const playerCount = this.#gameStateTracker.getPlayerCount();
      this.#socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.#socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };

  // waitForModToFinishReview = async (modLogger) => {
  //   while (modLogger.checkIfReviewingQuestion()) {
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //   }
  // };

  checkIfQueueNotEmptyAndSendAnswer = (socket, playerId) => {
    const questionQueueLength = this.#modQuestionQueue.getQuestionQueueLength(socket);
    console.log('questionQueueLength:', questionQueueLength);
    if (questionQueueLength !== 0) {
      const questionData = this.#modQuestionQueue.getQuestionFromQueue(socket, playerId);
      console.log('questionData:', questionData);
      this.sendAnswerToModerator(socket, questionData);
      // modQuestionQueue.removeQuestionFromQueue(socket, playerId);
      this.#modLogger.setIsReviewingQuestion(true);
    }
  }

  updateGameState = (socket) => { // Sends newest game state to the client
    this.#updateRounds(socket);
    this.#updateLeaderboard(socket);

    const roundInfo = this.#gameStateTracker.getRound();
    const isGameFinished = this.#gameStateTracker.checkIfGameOver(roundInfo)
    if(isGameFinished){
      this.#socketManager.emitToRoom(socket,'game_over');

    }
    else {
      this.#gameStateTracker.nextRound();
      this.#socketManager.emitToPlayers(socket,"disable_waiting_screen");
    }
  }

  startRound = (socket)=>{
    console.log("Start round");

    const strategies = this.#gameStateTracker.getStrategies(); //is een array
    const playerNames = this.#gameStateTracker.getPlayerList();
    this.sendPlayerCount(socket);

    for(let i = 0; i < playerNames.length; i++){
      const socketId = playerNames[i].id;
      const strategy = strategies[i];
      const name = playerNames[i].name;
      this.#socketManager.emitToSpecificSocket(socketId,'players_turn',strategy);
      this.#socketManager.emitToSpecificSocket(socketId,'player_names',name);
      this.#userLogger.setCanRollDice(socketId, true);
      this.#socketManager.emitToSpecificSocket(socketId, 'set_roll_dice', true);
    }
    this.#updateRounds(socket)
    this.#updateLeaderboard(socket);
  }

  updateAllBoards = (socket) => {
    const players = this.#userLogger.getAllPlayerObjects();
    const playerPositions = players.map(player => player.playerPosition);
    this.#socketManager.emitToRoom(socket,'update_position', playerPositions);
  }

  #updateLeaderboard = (socket) => {
    const userData = this.#userLogger.getAllPlayerObjects();
    this.#socketManager.emitToRoom(socket, "update_leaderboard", userData);
  }

  #updateRounds = (socket) => {
    const roundInfo = this.#gameStateTracker.getRound();
    this.#socketManager.emitToRoom(socket, "rounds", roundInfo);
  }
}

module.exports = GameManager;