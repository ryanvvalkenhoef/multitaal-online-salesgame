import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import "./BoardGridStyle.css";
import BoardManager from "../../modules/boardModule/BoardManager";
import BoardUtils from "../../modules/boardModule/BoardUtils";
import PlayerPopUps from "../../components/UI/PlayerPopUps";

const BoardGrid = React.forwardRef(({
  moveMade,
  setMoveMade,
  selectedPawn,           // The selected pawn for player
  setPosition,            // Function to update position of pawn
  playerColor,            // Color of the player
  startPieces,            // Startpieces for the players
  piecePositions,         // Positions of the pieces on the board
  handleTileClick,        // Function to handle the click on tile
  setIsBoardRendered,
  setTilesUseState,
  joinedColors,
  tileInfo,
  tileInfo2,
  possiblePositions,
  gameScreen,
}, ref) => {

  const [tiles, setTiles] = useState([]);
  const boardManagerInstance = useRef(null);  // Correct reference for BoardManager instance

  useEffect(() => {
    // Only instantiate the BoardManager once (on initial render)
    if (!boardManagerInstance.current) {
      boardManagerInstance.current = new BoardManager({
        selectedPawn,
        setPosition,
        playerColor,
        gameScreen,
        tileInfo,
        tileInfo2,
        joinedColors,
        startPieces,
        piecePositions,
        setIsBoardRendered,
      });
    } else {
      boardManagerInstance.current.updateSelectedPawn(selectedPawn);
    }

    if (boardManagerInstance.current) {
        const newTiles = boardManagerInstance.current.createTiles();

        // Prevent an endless render by only updating if the tiles really change
        if (newTiles !== tiles) {
          setTiles(newTiles);
        }
    }
  }, [tileInfo, tileInfo2, tiles, joinedColors, piecePositions, selectedPawn]);  // Zorg ervoor dat we de juiste dependencies hebben voor het effect

  useEffect(() => {
    if (boardManagerInstance.current) {
      boardManagerInstance.current.setRenderStatus(true);
    }
  }, []);

  useEffect(() => {
    if (boardManagerInstance.current) {
      boardManagerInstance.current.updateStartPieces(startPieces);
    }
  }, [startPieces]);

  useEffect(() => {
    if (boardManagerInstance.current) {
      boardManagerInstance.current.updatePiecePositions(piecePositions);
    }
  }, [piecePositions]);

  useEffect(() => {
    if (boardManagerInstance.current) {
      boardManagerInstance.current.updateJoinedColors(joinedColors);
    }
  }, [joinedColors]);

  return (
    <div className="board-grid">
      {/* Render de tegels */}
      {tiles}
    </div>
  );
});


export default BoardGrid;