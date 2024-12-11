const {
    handleTileInfoUpdate,
    handleTileInfo2Update,
    handlePieceAddition,
    handleColorAddition,
} = require("../GameScreen/Board/eventListenersBoard");


class RenderManager {
    #pieces;
    #tileInfo;
    #tileInfo2;
    #joinedColors;
    #setStartPieces;
    #setTileInfo;
    #setTileInfo2;
    #setJoinedColors;
    #setIsReadyToRender;

    constructor(setStartPieces, setTileInfo, setTileInfo2 ,setJoinedColors, setIsReadyToRender,socket) {
        this.#pieces = null;
        this.#tileInfo = null;
        this.#tileInfo2 = null;
        this.#joinedColors = null;
        this.#setStartPieces = setStartPieces;
        this.#setTileInfo = setTileInfo;
        this.#setTileInfo2 = setTileInfo2;
        this.#setJoinedColors = setJoinedColors;
        this.#setIsReadyToRender = setIsReadyToRender;


    }

    setPieces(pieces) {
        this.#pieces = pieces;
        this.#checkIfReady();
    }

    setTileInfo(tileInfo) {
        this.#tileInfo = tileInfo;
        this.#checkIfReady();
    }

    setTileInfo2(tileInfo2) {
        this.#tileInfo2 = tileInfo2;
        this.#checkIfReady();
    }

    setJoinedColors(joinedColors) {
        this.#joinedColors = joinedColors   ;
        this.#checkIfReady();
    }




    #checkIfReady() {
        console.log('Waiting on pieces: ' + !this.#pieces );
        console.log('Waiting on tileInfo: ' + !this.#tileInfo );
        console.log('Waiting on tileInfo2: ' + !this.#tileInfo2 );
        console.log('Waiting on joinedColors: ' + !this.#joinedColors );

        if (this.#pieces && this.#tileInfo && this.#tileInfo2 && this.#joinedColors) {
            this.#setStartPieces(this.#pieces);
            this.#setTileInfo(this.#tileInfo);
            this.#setTileInfo2(this.#tileInfo2);
            this.#setJoinedColors(this.#joinedColors);
            this.#setIsReadyToRender(true);

        }

    }
}

export default  RenderManager;