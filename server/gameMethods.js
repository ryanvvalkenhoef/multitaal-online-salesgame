// const SocketManager = require("./socketMethods");
// const modLogger = require("./modLogger");
// const userLogger = require("./userLogger");

class GameManager{

  constructor(io,userLogger,modLogger,socketManager) {
    this.io = io;
    this.userLogger = userLogger;
    this.modLogger = modLogger;
    this.socketManager = socketManager
  }



  sendPlayerCount(socket) {
      const playerCount = this.modLogger(socket.room, "getPlayerTotal", socket.id);
      this.socketManager.emitBackToClient(socket,"player_count",playerCount);
  }

  sendAnswerToModerator = (socket, questionData) => {
    this.socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };



  updateGameState = (io,socket) => {
    const roundInfo = this.modLogger(socket.room, "getRound", socket.id);
    if(this.checkIfGameOver(io,socket,roundInfo)){
      this.socketManager.emitToRoom(socket,'game_over');
    }
    else {
      this.modLogger(socket.room, "nextRound", socket.id);
      this.socketManager.emitToPlayers(socket,"submitted_points");
      this.socketManager.emitToRoom(socket,"rounds",roundInfo);
      const userData = this.userLogger(socket.room, "getData", socket.id);
      this.socketManager.emitToRoom(socket,"data_leaderboard",userData);
    }
  }

  startRound = (socket)=>{
    console.log("Start round");

    const strategies = this.modLogger(socket.room, "getPlayerTurn",socket.id); //is een array
    const playersList = this.modLogger(socket.room, "getPlayersList");
    this.sendPlayerCount(socket);

    for(let i = 0; i < playersList.length; i++){
      const socketId = playersList[i].id;
      const strategy = strategies[i];
      const name = playersList[i].name;
      this.socketManager.emitToSpecificSocket(socketId,'players_turn',strategy);
      this.socketManager.emitToSpecificSocket(socketId,'players_name',name);
    }
    const roundInfo = this.modLogger(socket.room, "getRound", socket.id);
    this.socketManager.emitToRoom(socket,'rounds',roundInfo);
  }


  updateAllBoards = (socket) =>{
    const players = this.userLogger(socket.room,'getAllPlayers');
    const playerPositions = players.map(player => player.playerPosition);
    this.socketManager.emitToRoom(socket,'update_position',playerPositions);
  }

  checkIfGameOver = (io,socket,roundInfo) =>{
    return roundInfo.currentRound === roundInfo.totalRounds;
  }





}

module.exports = GameManager;