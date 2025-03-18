import { sendQuestionRequest } from "./BoardEvents";

class BoardUtils {
    
    constructor() {}
  
    assignColorToTile(index, joinedColors, tileInfo, tileInfo2) {
      let totalColors = joinedColors.length
      let colorRanges = {
        //Blueprint for tile color assignment. If playing with 6 players for example
        //the yellow tiles will be tiles 1, and 7. Green tiles 2 and 8 etc
        0: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
        1: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
        2: [
          [1, 2, 3, 4, 5, 6],
          [7, 8, 9, 10, 11, 12],
        ],
        3: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
        ],
        4: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        5: [[1], [2], [3], [4], [5]],
        6: [
          [1, 7],
          [2, 8],
          [3, 9],
          [4, 10],
          [5, 11],
          [6, 12],
        ],
      };
      let currentTileInfo = totalColors === 5 ? tileInfo2 : tileInfo;
  
      // If not a black tile, return a color
      if (currentTileInfo[index].startsWith("color")) {
        let temp = parseInt(currentTileInfo[index].replace("color", ""));
        for (let range = 0; range < colorRanges[totalColors].length; range++) {
          if (colorRanges[totalColors][range].includes(temp)) {
            return joinedColors[range];
          }
        }
      } else {
        // black tile
        return currentTileInfo[index];
      }
    }
  
    highLightChecker(index, possiblePositions, validPositions) {
      // Function checks if a valid position is actually possible and should be highlighted
      const position = possiblePositions[index];
      return validPositions.includes(position);
    }
  
    createTiles({
      joinedColors,
      tileInfo,
      tileInfo2,
      possiblePositions,
      validPositions,
      startPieces,
      selectedPawn,
    }) {
      const tiles = [];
      for (let index = 0; index < this.tileInfo.length; index++) {
        const color = this.assignColorToTile(index, joinedColors, tileInfo, tileInfo2);
        const isHighlighted = this.highLightChecker(index, possiblePositions, validPositions);
        const tileClass = `tile ${color} ${isHighlighted ? "blink" : ""}`;
        const position = possiblePositions[index];
  
        const tile = new Tile({
          index,
          position,
          tileClass,
          renderStartPieces: this.setStartPiecesOnTile,
          startPieces,
          selectedPawn,
        });
        tiles.push(tile);
      }
      return tiles;
    }
  
    setPiecesOnTile({ piecePositions }) {
      // This function is used after the first time
      piecePositions.forEach((data) => {
        const newPosition = data.newPosition;
        const selectedPawnName = data.selectedPawn;
        const selectedPawnElement = document.getElementById(selectedPawnName);
  
        if (selectedPawnElement) {
          const newTile = document.querySelector(
            `.tile[data-pos="${newPosition}"]`
          );
          newTile.appendChild(selectedPawnElement);
        }
      });
    }
  
    setStartPiecesOnTile({ startPieces }) {
      // This function is used to set the pieces for the first time
      const START_POSITION = "8-5";
      for (let startPiece of startPieces) {
        const newPosition = START_POSITION;
        const selectedPawnElement = document.getElementById(startPiece);
  
        if (selectedPawnElement) {
          const newTile = document.querySelector(
            `.tile[data-pos="${newPosition}"]`
          );
          newTile.appendChild(selectedPawnElement);
        }
      }
    }
  
    handleTileClick({
      event,
      startPieces,
      validPositions,
      selectedPawn,
      playerColor,
      setPosition,
      socket,
    }) {
      console.log("click");
      const targetTile = event.target.closest(".tile");
      if (startPieces.includes(event.target.id)) {
        event.target.classList.add("highlight");
      } else if (
        targetTile &&
        validPositions.includes(targetTile.getAttribute("data-pos")) &&
        targetTile.classList.contains("blink")
      ) {
        const newPosition = targetTile.getAttribute("data-pos");
        if (validPositions.includes(newPosition)) {
          setPosition(newPosition);
          if (selectedPawn instanceof HTMLElement) {
            event.target.appendChild(selectedPawn);
            const color = targetTile.className.split(" ")[1];
            sendQuestionRequest(socket, color, playerColor);
            document
              .querySelectorAll(".tile")
              .forEach((tile) => tile.classList.remove("blink"));
            socket.emit("update_player_position", {
              newPosition: newPosition,
              selectedPawn: selectedPawn.id,
            });
          } else {
            console.error("Selected pawn is not a valid DOM element");
          }
        }
      }
    }
  }
  
  module.exports = BoardUtils;