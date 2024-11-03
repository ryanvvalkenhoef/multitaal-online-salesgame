
class GameManager{

  constructor(io,userLogger,modLogger,socketManager,gameStateTracker) {
    this.io = io;
    this.userLogger = userLogger;
    this.modLogger = modLogger;
    this.socketManager = socketManager
    this.gameStateTracker = gameStateTracker;
  }


  sendPlayerCount(socket) {
      const playerCount = this.gameStateTracker.getPlayerCount();
      this.socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };



  updateGameState = (io,socket) => { // Sends newest game state to the client
    const roundInfo = this.gameStateTracker.getRound();
    const userData = this.userLogger.getAllPlayerObjects();
    const isGameFinished = this.gameStateTracker.checkIfGameOver(roundInfo)

    this.socketManager.emitToRoom(socket,"update_leaderboard",userData);
    this.socketManager.emitToRoom(socket,"rounds",roundInfo);

    if(isGameFinished){
      this.socketManager.emitToRoom(socket,'game_over');
    }
    else {
      this.gameStateTracker.nextRound();
      this.socketManager.emitToPlayers(socket,"disable_waiting_screen");
    }
  }

  startRound = (socket)=>{
    console.log("Start round");

    const strategies = this.gameStateTracker.getStrategies(); //is een array
    const playerNames = this.gameStateTracker.getPlayerList()
    this.sendPlayerCount(socket);

    for(let i = 0; i < playerNames.length; i++){
      const socketId = playerNames[i].id;
      const strategy = strategies[i];
      const name = playerNames[i].name;
      this.socketManager.emitToSpecificSocket(socketId,'players_turn',strategy);
      this.socketManager.emitToSpecificSocket(socketId,'player_names',name);
    }
    const roundInfo = this.gameStateTracker.getRound();
    this.socketManager.emitToRoom(socket,'rounds',roundInfo);
  }


  updateAllBoards = (socket) =>{
    const players = this.userLogger.getAllPlayerObjects();
    const playerPositions = players.map(player => player.playerPosition);
    this.socketManager.emitToRoom(socket,'update_position',playerPositions);
  }







}

module.exports = GameManager;