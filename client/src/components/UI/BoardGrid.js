import React from "react";
import "./BoardGridStyle.css";
import BoardManager from "../../modules/boardModule/BoardManager";
import PlayerPopUps from "../../GameScreen/PopUps/PlayerPopUps";

const BoardGrid = ({
  tilesUseState,          // The created tiles
  validPositions,         // Valid positions for pawns
  selectedPawn,           // The selected pawn for player
  setPosition,            // Function to update position of pawn
  playerColor,            // Color of the player
  startPieces,            // Startpieces for the players
  piecePositions,         // Positions of the pieces on the board
  handleTileClick,        // Function to handle the click on tile
}) => {

    BoardManager({
        ...props,
        socket,
        setValidPositions,
        setPosition,
        validPositions,
        setIsBoardRendered,
        startPieces,
        piecePositions,
        setTilesUseState,
        joinedColors,
        tileInfo,
        tileInfo2,
        possiblePositions,
        selectedPawn,
        gameScreen
      });

  return (
    <div className="board-grid">
      {/* Render the tiles */}
      {tilesUseState.map((tile, index) => (
        <div
          key={index}
          className={`tile ${validPositions.includes(tile.position) ? "valid" : ""}`}
          onClick={(event) =>
            handleTileClick({
              event,
              startPieces,
              selectedPawn,
              validPositions,
              playerColor,
              setPosition,
            })
          }
        >
          {/* Show the contents of the tile */}
          {tile.content}
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;