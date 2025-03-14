import { useEffect, useState } from "react";
import { socket } from "../../client";
import {
  cleanUpSocketListeners,
  handlePositionsUpdate,
  handleValidPositionsUpdate,
} from "./BoardEvents";
import { createTiles, handleTileClick, setPiecesOnTile, setStartPiecesOnTile } from "./boardFunctions";

const BoardManager = ({
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
}) => {
  const [validPositions, setValidPositions] = useState([]);
  const [tilesUseState, setTilesUseState] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const possiblePositions = [
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

  // Initializing valid positions and handling socket events
  useEffect(() => {
    handleValidPositionsUpdate(socket, setValidPositions);
    handlePositionsUpdate(socket, validPositions, setPosition, (data) => setPosition(data));
    setIsBoardRendered(true);

    return () => {
      cleanUpSocketListeners(socket);
    };
  }, []);

  useEffect(() => {
    // Handle the click events on the board
    const boardGrid = document.querySelector(".board-grid");
    if (gameScreen && boardGrid !== null) {
      const handleClick = (event) =>
        handleTileClick({
          event,
          startPieces,
          selectedPawn,
          validPositions,
          playerColor,
          setPosition,
        });

      boardGrid.addEventListener("click", handleClick);

      return () => {
        if (boardGrid) {
          boardGrid.removeEventListener("click", handleClick);
        }
      };
    }
  }, [validPositions]);

  useEffect(() => {
    // Create the tiles and update the state
    const tiles = createTiles({
      joinedColors,
      tileInfo,
      tileInfo2,
      possiblePositions,
      validPositions,
      startPieces,
      selectedPawn,
      piecePositions,
    });
    setTilesUseState(tiles);
  }, [joinedColors, validPositions]);

  useEffect(() => {
    if (!isFirstRender) {
      if (piecePositions[0] === "") {
        setStartPiecesOnTile({ startPieces });
      } else {
        setPiecesOnTile({ piecePositions });
      }
    }
  }, [piecePositions, isFirstRender]);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return { tilesUseState, validPositions, handleTileClick }; // Retourneer de benodigde waarden en functies naar BoardGrid
};

export default BoardManager;