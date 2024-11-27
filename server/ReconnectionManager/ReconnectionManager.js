class ReconnectionManager {

    /** @type {UserLogger} */
    #userLogger
    /** @type {ModLogger} */
    #modLogger
    /** @type {#GameScreenDataEmitter} */
    #gameScreenDataEmitter
    /** @type {#GameManager} */
    #gameManager;
    /** @type {#SocketManager} */
    #socketManager



    constructor(userLogger, modLogger,gameScreenDataEmitter, gameManager, socketManager) {
        this.#userLogger = userLogger;
        this.#modLogger = modLogger;
        this.#gameScreenDataEmitter = gameScreenDataEmitter;
        this.#gameManager = gameManager;
        this.#socketManager = socketManager

    }

    reconnectPlayer = (socket , sessionData) =>{
        this.#updatePlayerId(socket,sessionData);
        this.#sendLeaderBoardData(socket);
        this.#sendNewPositionsData(socket)
        this.#sendPiecesData(socket);
        this.#sendPlayerColors(socket);
        this.#sendRoundInfo(socket);
        this.#sendPlayerPositions(socket);
        this.#linkPlayerToPiece(socket);
        this.#sendPlayerNames(socket);
        this.#setTurnStatusTrue(socket);



    }

    reconnectMod = (socket, sessionData) =>{
        this.#updateModId(socket,sessionData);
        this.#sendBoardData(socket);
        this.#sendLeaderBoardData(socket);
        this.#sendNewPositionsData(socket)
        this.#sendPiecesData(socket);
        this.#sendPlayerColors(socket);
        this.#sendRoundInfo(socket);
        this.#sendPlayerPositions(socket);
        this.#setTurnStatusTrue(socket);
    }

    #updatePlayerId = (socket, sessionData) =>{
        const oldSocketId = sessionData.socketId;
        this.#userLogger.reconnect(socket.id,oldSocketId);
    }
    #updateModId = (socket,sessionData) =>{
        const oldSocketId = sessionData.socketId;
        this.#modLogger.reconnect(socket.id,oldSocketId);
    }
    #sendBoardData = (socket) =>{
        this.#gameScreenDataEmitter.sendBoardData(socket);
    }
    #sendLeaderBoardData = (socket) =>{
        this.#gameScreenDataEmitter.sendLeaderboardData(socket)
    }
    #sendRoundInfo = (socket) =>{
        this.#gameScreenDataEmitter.sendRoundData(socket);
    }
    #sendNewPositionsData = (socket) =>{
        this.#gameScreenDataEmitter.sendNewPositionsData(socket);
    }
    #sendPiecesData = (socket) =>{
        this.#gameScreenDataEmitter.sendPiecesData(socket);
    }
    #sendPlayerPositions = (socket) =>{
        this.#gameManager.updatePiecePositions(socket)
    }
    #sendPlayerColors = (socket) =>{
        this.#gameScreenDataEmitter.sendPlayerColors(socket);
    }
    #linkPlayerToPiece = (socket) =>{
        const strategy = this.#userLogger.getStrategy(socket.id);
        this.#socketManager.emitBackToClient(socket,'players_turn',strategy);
    }
    #sendPlayerNames = (socket) =>{
        const name = this.#userLogger.getPlayerName(socket.id);
        this.#socketManager.emitBackToClient(socket,'player_names',name);
    }
    #setTurnStatusTrue = (socket) =>{
        this.#socketManager.emitBackToClient(socket, 'set_turn_true');
    }


}

module.exports = ReconnectionManager;