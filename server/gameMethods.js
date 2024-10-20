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
      //socket.emit("player_count", playerCount);
      this.socketManager.emitBackToClient(socket,"player_count");
  }

   sendAnswerToModerator = (socket, questionData) => {
    //io.to("mod").emit("receive_player_answer", questionData);
    this.socketManager.emitToMod(socket,"receive_player_answer",questionData);
  };



   updateGameState = (io,socket) => {
    const roundInfo = this.modLogger(socket.room, "getRound", socket.id);
    if(this.checkIfGameOver(io,socket,roundInfo)){
      //io.emit('game_over');
      this.socketManager.emitToRoom(socket,'game_over');
    }
    else {
      this.modLogger(socket.room, "nextRound", socket.id);
      //io.to("players").emit("submitted_points");
        console.log('submitted points')
        this.socketManager.emitToPlayers(socket,"submitted_points");


      //io.emit("rounds", roundInfo);
      this.socketManager.emitToRoom(socket,"rounds",roundInfo);

      const userData = this.userLogger(socket.room, "getData", socket.id);
      //io.emit("data_leaderboard", userData);
      this.socketManager.emitToRoom(socket,"data_leaderboard",userData);
    }
  }

   startRound = (io,socket)=>{
    console.log("Start round");

    const strategies = this.modLogger(socket.room, "getPlayerTurn",socket.id); //is een array
    const playersList = this.modLogger(socket.room, "getPlayersList");
    this.sendPlayerCount(socket);

    for(let i = 0; i < playersList.length; i++){
      const socketId = playersList[i].id;
      const strategy = strategies[i];
      const name = playersList[i].name;

      //io.to(socketId).emit('players_turn',strategy);
      //io.to(socketId).emit('players_name', name) // heeft te maken met knipperen van naam op leaderbord en turn text
        this.socketManager.emitToSpecificSocket(socketId,'players_turn',strategy);
        this.socketManager.emitToSpecificSocket(socketId,'players_name',name);
    }
  }


   updateAllBoards = (socket) =>{
    const players = this.userLogger(socket.room,'getAllPlayers');
    const playerPositions = players.map(player => player.playerPosition);
    //io.emit('update_position',playerPositions);
    this.socketManager.emitToRoom(socket,'update_position',playerPositions);
  }

  checkIfGameOver = (io,socket,roundInfo) =>{
    return roundInfo.currentRound === roundInfo.totalRounds;
  }



}

module.exports = GameManager;