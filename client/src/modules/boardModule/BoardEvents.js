class BoardEvents {

    constructor() {  }
  
    handleValidPositionsUpdate(socket, setValidPosition) {
      socket.on('update_valid_positions', (ValidPositionArray) => {
        setValidPosition(ValidPositionArray);
      });
    }
  
    handlePositionsUpdate(socket, validPositions) {
      socket.on('update_piece_positions', (newPositionData) => {
        newPositionData.forEach((data) => {
          const newPosition = data.newPosition;
          const selectedPawnName = data.selectedPawn;
          const selectedPawnElement = document.getElementById(selectedPawnName);
    
          if (selectedPawnElement) {
            const newTile = document.querySelector(
              `.tile[data-pos='${newPosition}']`,
            );
            newTile.appendChild(selectedPawnElement);
            document
              .querySelectorAll('.tile')
              .forEach((tile) => tile.classList.remove('blink'));
          }
        });
      });
    }
  
    cleanUpSocketListeners(socket) {
      socket.off('update_valid_positions');
      socket.off('update_piece_positions');
    }
  
    // Emitter for question request
    sendQuestionRequest(socket, colorTile, playerColor) {
      socket.emit('send_question_request', {
        questionColor: colorTile,
        userColor: playerColor
      })
    }
  }
  
  module.exports = EventListenersBoard;