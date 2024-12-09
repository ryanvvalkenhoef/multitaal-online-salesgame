class GameManager{
  /** @type {UserLogger} */
  #userLogger
  /** @type {SocketManager} */
  #socketManager
  /** @type {GameStateTracker} */
  #gameStateTracker
  /**@type {GameScreenDataEmitter}*/
  #gameScreenDataEmitter

  constructor(userLogger,socketManager,gameStateTracker, gameScreenDataEmitter) {
    this.#userLogger = userLogger;
    this.#socketManager = socketManager;
    this.#gameStateTracker = gameStateTracker;
    this.#gameScreenDataEmitter = gameScreenDataEmitter;
  }


  sendPlayerCount(socket) {
      const playerCount = this.#gameStateTracker.getPlayerCount();
      this.#socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.#socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };


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
    console.log("Start round");

    const strategies = this.#gameStateTracker.getStrategies(); //is een array
    const playerNames = this.#gameStateTracker.getPlayerList()
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
      // this.#updateRounds(socket)
      // this.#updateLeaderboard(socket);
      this.#gameScreenDataEmitter.sendRoundData(socket);
      this.#gameScreenDataEmitter.sendLeaderboardData(socket);
  }

  // enableRollDice = (socketId) => {
  //   if (!this.#userLogger) {
  //     console.error("userLogger is not initialized");
  //     return;
  //   }
  //   console.log("whyyyyyyy", this.#userLogger);
  //   this.#userLogger.setCanRollDice(socketId, true);
  //   this.#socketManager.emitToSpecificSocket(socketId, 'set_roll_dice', true);
  // }

  // disableRollDice = (socketId) => {
  //   if (!this.#userLogger) {
  //     console.error("userLogger is not initialized22222");
  //     return;
  //   }
  //   console.log("whyyyyyyy2", this.#userLogger);
  //   this.#userLogger.setCanRollDice(socketId, false);
  //   this.#socketManager.emitToSpecificSocket(socketId, 'set_roll_dice', false);
  // }

  // updateAllBoards = (socket) =>{
  //   const players = this.#userLogger.getAllPlayerObjects();
  //   const playerPositions = players.map(player => player.playerPosition);
  //   this.#socketManager.emitToRoom(socket,'update_piece_position',playerPositions);
  // }
    updatePiecePositions = (socket) =>{
        // const players = this.#userLogger.getAllPlayerObjects();
        // const playerPositions = players.map(player => player.playerPosition);
        // this.#socketManager.emitToRoom(socket,'update_piece_position',playerPositions);
        this.#gameScreenDataEmitter.sendNewPositionsData(socket);
    }

  //
  // #updateLeaderboard = (socket) => {
  //   const userData = this.#userLogger.getAllPlayerObjects();
  //   this.#socketManager.emitToRoom(socket, "update_leaderboard", userData);
  // }
  //
  // #updateRounds = (socket) => {
  //   const roundInfo = this.#gameStateTracker.getRound();
  //   this.#socketManager.emitToRoom(socket, "rounds", roundInfo);
  // }


}

module.exports = GameManager;