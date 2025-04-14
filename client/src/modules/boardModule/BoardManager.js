import { socket } from "../../client.js";
import BoardEvents from "./BoardEvents";
import BoardUtils from "./BoardUtils";

class BoardManager {

  constructor({
    selectedPawnRef,
    setPosition,
    playerColor,
    gameScreen,
    tileInfo,
    tileInfo2,
    joinedColors,
    startPieces,
    piecePositions,
    setIsBoardRendered,
    setTiles,
  }) {
    // Sla de props op in instantievariabelen
    this.selectedPawnRef = selectedPawnRef;
    this.setPosition = setPosition;
    this.playerColor = playerColor;
    this.gameScreen = gameScreen;
    this.tileInfo = tileInfo;
    this.tileInfo2 = tileInfo2;
    this.joinedColors = joinedColors;
    this.startPieces = startPieces;
    this.piecePositions = piecePositions;
    this.setIsBoardRendered = setIsBoardRendered;

    this.validPositions = [];
    this.tilesUseState = [];
    this.isFirstRender = true;
    this.isInitialized = false;
    
    this.setTiles = setTiles;

    this.renderStatus = false;

    this.possiblePositions = [
      '1-9', '2-9', '3-9', '4-9', '5-9', '6-9', '7-9', '8-9', '9-9', '10-9', '11-9', '12-9', '13-9', '14-9', '15-9',
      '1-8', '',    '',    '',    '',    '',    '',    '8-8', '',    '',     '',     '',     '',     '',     '15-8',
      '1-7', '',    '',    '',    '',    '',    '',    '8-7', '',    '',     '',     '',     '',     '',     '15-7',
      '1-6', '',    '',    '',    '',    '',    '',    '8-6', '',    '',     '',     '',     '',     '',     '15-6',
      '1-5', '2-5', '3-5', '4-5', '5-5', '6-5', '7-5', '8-5', '9-5', '10-5', '11-5', '12-5', '13-5', '14-5', '15-5',
      '1-4', '',    '',    '',    '',    '',    '',    '8-4', '',    '',     '',     '',     '',     '',     '15-4',
      '1-3', '',    '',    '',    '',    '',    '',    '8-3', '',    '',     '',     '',     '',     '',     '15-3',
      '1-2', '',    '',    '',    '',    '',    '',    '8-2', '',    '',     '',     '',     '',     '',     '15-2',
      '1-1', '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1', '11-1', '12-1', '13-1', '14-1', '15-1',
    ];

    // Initialisatie
    this.initialize();
  }

  updateSelectedPawn(selectedPawn) {
    this.selectedPawn = selectedPawn;
  }

  updateStartPieces(startPieces) {
    this.startPieces = startPieces;
  }

  updateJoinedColors(joinedColors) {
    this.joinedColors = joinedColors;
    this.createTiles();
  }

  updatePiecePositions(piecePositions) {
    this.piecePositions = piecePositions;
  }

  setRenderStatus(status) {
    this.renderStatus = status;
  }

  getRenderStatus() {
    return this.renderStatus;
  }

  initialize() {
    console.log("BoardManager initialised");
    this.handleTileClick();
    // Handle valid positions and socket events
    setInterval(() => {
      BoardEvents.handleValidPositionsUpdate(socket, (validPositions) => this.setValidPositions(validPositions));
      BoardEvents.handlePositionsUpdate(socket, this.validPositions, this.setPosition, (data) => {
        this.setPosition(data);
      });
      this.setPieces();
    }, 1000);
  }

  setValidPositions(validPositionsArray) {
    this.validPositions = validPositionsArray;
    console.log("Nieuwe validPositions ontvangen:", this.validPositions);
    this.createTiles();
  }

  handleTileClick() {
    const boardGrid = document.querySelector(".board-grid");
    if (this.gameScreen && boardGrid !== null) {
      const handleClick = (event) =>
        BoardUtils.handleTileClick({
          event,
          startPieces: this.startPieces,
          selectedPawn: this.selectedPawn,
          validPositions: this.validPositions,
          playerColor: this.playerColor,
          setPosition: this.setPosition,
          socket
        });

      boardGrid.addEventListener("click", handleClick);
    }
  }

  createTiles() {
    // Maak de tegels en werk de staat bij
    const tiles = BoardUtils.createTiles({
      joinedColors: this.joinedColors,
      tileInfo: this.tileInfo,
      tileInfo2: this.tileInfo2,
      possiblePositions: this.possiblePositions,
      validPositions: this.validPositions,
      startPieces: this.startPieces,
      selectedPawn: this.selectedPawn,
    });

    this.tilesUseState = tiles;
    return tiles
  }

  setFirstRender() {
    this.isFirstRender = false;
  }

  setPieces() {
    if (!this.isFirstRender) {
      if (this.piecePositions[0] === "") {
        console.log('passed1:' + this.piecePositions);
        BoardUtils.setStartPiecesOnTile({ startPieces: this.startPieces });
        this.piecePositions = [];
      } else {
        console.log('passed2');
        BoardUtils.setPiecesOnTile({ piecePositions: this.piecePositions });
      }
    } else {
      if (this.getRenderStatus()) this.isFirstRender = false
      this.setPieces();
    }
  }

  update() {
    console.log('update: ' + this.isFirstRender);
    this.createTiles();
  }
}

export default BoardManager;