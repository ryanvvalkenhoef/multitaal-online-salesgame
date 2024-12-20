class GameManager{
  /** @type {UserLogger} */
  #userLogger
  #modLogger
  /** @type {SocketManager} */
  #socketManager
  /** @type {GameStateTracker} */
  #gameStateTracker
  /** @type {ModQuestionQueue} */
  #modQuestionQueue
  /**@type {GameScreenDataEmitter}*/
  #gameScreenDataEmitter


  constructor(userLogger,modLogger,socketManager,gameStateTracker, modQuestionQueue,gameScreenDataEmitter) {
    this.#userLogger = userLogger;
    this.#modLogger = modLogger;
    this.#socketManager = socketManager
    this.#gameStateTracker = gameStateTracker;
    this.#modQuestionQueue = modQuestionQueue;
    this.#gameScreenDataEmitter = gameScreenDataEmitter;
  }


  sendPlayerCount(socket) {
      const playerCount = this.#gameStateTracker.getPlayerCount();
      this.#socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.#socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };


  checkIfQueueNotEmptyAndSendAnswer = (socket, playerId) => {
    const questionQueueLength = this.#modQuestionQueue.getQuestionQueueLength(socket, playerId);
    if (questionQueueLength !== 0) {
      const questionData = this.#modQuestionQueue.getQuestionFromQueue(socket, playerId);
      this.sendAnswerToModerator(socket, questionData);
      // modQuestionQueue.removeQuestionFromQueue(socket, playerId);
      this.#modLogger.setIsReviewingQuestion(true);
    } else {
      this.#userLogger.setHasBeenReviewed(playerId, true);
      this.#socketManager.emitBackToClient(socket, 'player_has_been_reviewed', {playerId: playerId, hasBeenReviewed: true});
    }
  }

  updateGameState = (socket) => { // Sends newest game state to the client
    // this.#updateRounds(socket);
    // this.#updateLeaderboard(socket);
    this.#gameScreenDataEmitter.sendRoundData(socket);
    this.#gameScreenDataEmitter.sendLeaderboardData(socket);


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
      this.#gameScreenDataEmitter.sendRoundData(socket);
      this.#gameScreenDataEmitter.sendLeaderboardData(socket);
  }



  // updateAllBoards = (socket) =>{
  //   const players = this.#userLogger.getAllPlayerObjects();
  //   const playerPositions = players.map(player => player.playerPosition);
  //   this.#socketManager.emitToRoom(socket,'update_piece_positions',playerPositions);
  // }
    updatePiecePositions = (socket) =>{
        // const players = this.#userLogger.getAllPlayerObjects();
        // const playerPositions = players.map(player => player.playerPosition);
        // this.#socketManager.emitToRoom(socket,'update_piece_positions',playerPositions);
        this.#gameScreenDataEmitter.sendPositionsData(socket);
    }




}

module.exports = GameManager;