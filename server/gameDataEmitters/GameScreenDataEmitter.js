class GameScreenDataEmitter{

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

    sendBoardData = (socket) =>{
        //TILE_INFO FOR WHEN 2-6 PLAYERS JOIN
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
        ]

        //TILE_INFO FOR WHEN 5 PLAYERS JOIN
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
        ]

        this.#socketManager.emitBackToClient(socket, 'send_tileInfo', tileInfo);
        this.#socketManager.emitBackToClient(socket, 'send_tileInfo2', tileInfo2);
    }


    sendNewPositionsData = (socket) =>{
        const players = this.#userLogger.getAllPlayerObjects();
        const playerPositions = players.map(player => player.playerPosition);
        this.#socketManager.emitToRoom(socket,'update_piece_positions',playerPositions);
    }

    sendLeaderboardData = (socket) => {
        const userData = this.#userLogger.getAllPlayerObjects();
        this.#socketManager.emitToRoom(socket, "update_leaderboard", userData);
    }

    sendRoundData = (socket) => {
        const roundInfo = this.#gameStateTracker.getRound();
        this.#socketManager.emitToRoom(socket, "rounds", roundInfo);
    }

    sendPiecesData = (socket) =>{
        const pieces = this.#gameStateTracker.getStrategies();
        this.#socketManager.emitToRoom(socket, 'add_piece', pieces);
    }

    sendPlayerColors = (socket) =>{
        const pieces = this.#gameStateTracker.getStrategies();
        this.#socketManager.emitBackToClient(socket,"add_player_color",pieces);
    }

}

module.exports = GameScreenDataEmitter;