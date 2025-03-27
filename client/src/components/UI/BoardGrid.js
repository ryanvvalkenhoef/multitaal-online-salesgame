import React, { useEffect } from "react";
import { socket } from "../../client.js";
import "./BoardGridStyle.css";
import BoardManager from "../../modules/boardModule/BoardManager";
import PlayerPopUps from "../../components/UI/PlayerPopUps";

const BoardGrid = ({
  tilesUseState,          // The created tiles
  validPositions,         // Valid positions for pawns
  selectedPawn,           // The selected pawn for player
  setPosition,            // Function to update position of pawn
  playerColor,            // Color of the player
  startPieces,            // Startpieces for the players
  piecePositions,         // Positions of the pieces on the board
  handleTileClick,        // Function to handle the click on tile
  setValidPositions,
  setIsBoardRendered,
  setTilesUseState,
  joinedColors,
  tileInfo,
  tileInfo2,
  possiblePositions,
  gameScreen,
}) => {

    let boardManager = new BoardManager({
      selectedPawn: selectedPawn,
      setPosition: setPosition,
      playerColor: playerColor,
      gameScreen: gameScreen,
      tileInfo: tileInfo,
      tileInfo2: tileInfo2,
      joinedColors: joinedColors,
      startPieces: startPieces,
      piecePositions: piecePositions,
      setIsBoardRendered: setIsBoardRendered,
    });

    // Update the status after initialisation
    boardManager.update();

  return (
    <div className="board-grid">
      {/* Render the tiles */}
      {boardManager.tilesUseState}
    </div>
  );
};

export default BoardGrid;