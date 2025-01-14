class ReconnectionManager {
  /** @type {UserLogger} */
  #userLogger;
  /** @type {ModLogger} */
  #modLogger;
  /** @type {#GameScreenDataEmitter} */
  #gameScreenDataEmitter;
  /** @type {#GameManager} */
  #gameManager;
  /** @type {#SocketManager} */
  #socketManager;
  /** @type {#GameStateTracker} */
  #gameStateTracker;

  constructor(
    userLogger,
    modLogger,
    gameScreenDataEmitter,
    gameManager,
    socketManager,
    gameStateTracker,
  ) {
    this.#userLogger = userLogger;
    this.#modLogger = modLogger;
    this.#gameScreenDataEmitter = gameScreenDataEmitter;
    this.#gameManager = gameManager;
    this.#socketManager = socketManager;
    this.#gameStateTracker = gameStateTracker;
  }

  reconnectPlayer = (socket, sessionData) => {
    this.#updatePlayerId(socket, sessionData);
    this.#sendBoardData(socket);
    this.#sendLeaderBoardData(socket);
    this.#sendPositionsData(socket);
    this.#sendPlayerPosition(socket);
    this.#sendPiecesData(socket);
    this.#sendPlayerColors(socket);
    this.#sendRoundData(socket);
    this.#linkPlayerToPiece(socket);
    this.#sendPlayerNames(socket);
    this.#setTurnStatusTrue(socket);
    this.#setRollDiceStatus(socket);
    this.#registerPlayer(socket);
  };

  reconnectMod = (socket, sessionData) => {
    this.#updateModId(socket, sessionData);
    this.#sendBoardData(socket);
    this.#sendLeaderBoardData(socket);
    this.#sendPositionsData(socket);
    this.#sendPiecesData(socket);
    this.#sendPlayerColors(socket);
    this.#sendRoundData(socket);
    this.#sendPlayerProgressModScreen(socket);
  };

  #updatePlayerId = (socket, sessionData) => {
    const oldSocketId = sessionData.socketId;
    this.#userLogger.reconnect(socket.id, oldSocketId);
  };
  #updateModId = (socket, sessionData) => {
    const oldSocketId = sessionData.socketId;
    this.#modLogger.reconnect(socket.id, oldSocketId);
  };
  #sendBoardData = (socket) => {
    //prettier-ignore
    const tileInfo = [
      'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
      'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
      'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
      'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
      'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
      'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
      'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
      'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
      'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
    ];

    //TILE_INFO FOR WHEN 5 PLAYERS JOIN
    //prettier-ignore
    const tileInfo2 = [
      'sales', 'color1', 'color5', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color1', 'sales', 'rainbow', 'color3', 'megatrends', 'color4', 'color2',
      'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
      'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color5',
      'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
      'rainbow', 'sales', 'color2', 'chance', 'color1', 'megatrends', 'color4', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color1', 'color3', 'sales',
      'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color5',
      'color4', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
      'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
      'sales', 'rainbow', 'color5', 'chance', 'color2', 'color1', 'megatrends', 'rainbow', 'color5', 'sales', 'color2', 'color3', 'chance', 'rainbow', 'color5'
    ];

    this.#socketManager.emitBackToClient(socket, "send_tileInfo", tileInfo);
    this.#socketManager.emitBackToClient(socket, "send_tileInfo2", tileInfo2);
  };
  #sendLeaderBoardData = (socket) => {
    const userData = this.#userLogger.getAllPlayerObjects();
    this.#socketManager.emitBackToClient(
      socket,
      "update_leaderboard",
      userData,
    );
  };
  #sendRoundData = (socket) => {
    const roundInfo = this.#gameStateTracker.getRound();
    this.#socketManager.emitBackToClient(socket, "rounds", roundInfo);
  };
  #sendPositionsData = (socket) => {
    const players = this.#userLogger.getAllPlayerObjects();
    const playerPositions = players.map((player) => player.playerPosition);
    this.#socketManager.emitBackToClient(
      socket,
      "update_piece_positions",
      playerPositions,
    );
  };
  #sendPlayerPosition = (socket) => {
    const playerId = socket.id;
    if (!playerId) {
      console.error("Player id is null or undefined: #sendPlayerPosition()");
      return;
    }
    const players = this.#userLogger.getAllPlayerObjects();
    const player = players.find((player) => player.id === playerId);
    if (!player) {
      console.error("Couldn't find player: #sendPlayerPostion()");
      return;
    }
    // When the player hasn't made a move yet, the playerPosition property is an empty string
    // So when the player hasn't made a move the start position 8-5 will be sent to the client
    const playerPosition =
      player.playerPosition === "" ? "8-5" : player.playerPosition.newPosition;
    this.#socketManager.emitBackToClient(
      socket,
      "set_player_position",
      playerPosition,
    );
  };
  #sendPiecesData = (socket) => {
    //Causes user not found5 warning when the moderator reconnects, but it's not a problem.
    const pieces = this.#gameStateTracker.getStrategies();
    this.#socketManager.emitBackToClient(socket, "add_piece", pieces);
  };

  #sendPlayerColors = (socket) => {
    const pieces = this.#gameStateTracker.getStrategies();
    this.#socketManager.emitBackToClient(socket, "add_player_color", pieces);
  };

  #linkPlayerToPiece = (socket) => {
    const strategy = this.#userLogger.getStrategy(socket.id);
    this.#socketManager.emitBackToClient(socket, "players_turn", strategy);
  };
  #sendPlayerNames = (socket) => {
    const name = this.#userLogger.getPlayerName(socket.id);
    this.#socketManager.emitBackToClient(socket, "player_names", name);
  };
  #setTurnStatusTrue = (socket) => {
    this.#socketManager.emitBackToClient(socket, "set_turn_true");
  };
  #setRollDiceStatus = (socket) => {
    const hasFinishedTurn = this.#userLogger.getPlayerTurnStatus(socket.id);
    if (!hasFinishedTurn) {
      this.#socketManager.emitBackToClient(socket, "set_roll_dice", true);
    }
  };

  #registerPlayer = (socket) => {
    //tijdelijke functie
    const strategy = this.#userLogger.getStrategy(socket.id);
    const color = this.#userLogger.getColor(socket.id);
    this.#socketManager.emitBackToClient(socket, "register_current_player", {
      strategy: strategy,
      color: color,
    });
  };

  #sendPlayerProgressModScreen = (socket) => {
    const players = this.#userLogger.getAllPlayerObjects();
    if (!players) {
      console.error("Can't get players: #sendPlayerProgressModScreen()");
      return;
    }

    players.forEach((player) => {
      if (player.isAnsweringQuestion) {
        this.#socketManager.emitToMod(socket, "player_is_answering", {
          playerId: player.id,
          isAnsweringQuestion: player.isAnsweringQuestion,
        });
      }
      if (player.hasFinishedTurn) {
        this.#socketManager.emitToMod(socket, "player_has_finished_turn", {
          playerId: player.id,
          hasFinishedTurn: player.hasFinishedTurn,
        });
      }
      if (player.hasBeenReviewed) {
        this.#socketManager.emitToMod(socket, "player_has_been_reviewed", {
          playerId: player.id,
          hasBeenReviewed: player.hasBeenReviewed,
        });
      }
    });
  };
}
module.exports = ReconnectionManager;
