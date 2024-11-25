class GameManager{
  /** @type {UserLogger} */
  #userLogger
  /** @type {SocketManager} */
  #socketManager
  /** @type {GameStateTracker} */
  #gameStateTracker
  
  constructor(userLogger,socketManager,gameStateTracker) {
    this.#userLogger = userLogger;
    this.#socketManager = socketManager
    this.#gameStateTracker = gameStateTracker;
  }


  sendPlayerCount(socket) {
      const playerCount = this.#gameStateTracker.getPlayerCount();
      this.#socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.#socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };


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
    const playerNames = this.#gameStateTracker.getPlayerList()
    this.sendPlayerCount(socket);

    for(let i = 0; i < playerNames.length; i++){
      const socketId = playerNames[i].id;
      const strategy = strategies[i];
      const name = playerNames[i].name;
      this.#socketManager.emitToSpecificSocket(socketId,'players_turn',strategy);
      this.#socketManager.emitToSpecificSocket(socketId,'player_names',name);
      this.#socketManager.emitToSpecificSocket(socketId, 'set_turn_true');
    }
    this.#updateRounds(socket)
    this.#updateLeaderboard(socket);
  }


  updateAllBoards = (socket) =>{
    const players = this.#userLogger.getAllPlayerObjects();
    const playerPositions = players.map(player => player.playerPosition);
    this.#socketManager.emitToRoom(socket,'update_position',playerPositions);
  }

  reconnectPlayer = (socket , sessionData) =>{
    console.log("sessonData soxketID:",sessionData.socketId)
    const oldSocketId = sessionData.socketId;
    this.#userLogger.reconnect(socket.id,oldSocketId);

    const userData = this.#userLogger.getAllPlayerObjects();
    this.#socketManager.emitBackToClient(socket, "update_leaderboard", userData);

    const roundInfo = this.#gameStateTracker.getRound();
    this.#socketManager.emitBackToClient(socket, "rounds", roundInfo);

    const players = this.#userLogger.getAllPlayerObjects();
    const playerPositions = players.map(player => player.playerPosition);
    this.#socketManager.emitBackToClient(socket,'update_position',playerPositions);

    const strategy = this.#userLogger.getStrategy(socket.id);
    this.#socketManager.emitBackToClient(socket,'players_turn',strategy);
    const name = this.#userLogger.getPlayerName(socket.id);
    this.#socketManager.emitBackToClient(socket,'player_names',name);
    this.#socketManager.emitBackToClient(socket, 'set_turn_true');

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