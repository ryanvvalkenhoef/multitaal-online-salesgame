class BoardEvents {

    constructor() { }
  
    static handleValidPositionsUpdate(socket, setValidPositions) {
      socket.on('update_valid_positions', (ValidPositionArray) => {
        setValidPositions(ValidPositionArray);
      });
    }
  
    static handlePositionsUpdate(socket, validPositions) {
      socket.on('update_piece_positions', (newPositionData) => {
        newPositionData.forEach((data) => {
          console.log('POSITIONS: ' + data);
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
  
    static cleanUpSocketListeners(socket) {
      socket.off('update_valid_positions');
      socket.off('update_piece_positions');
    }
  
    // Emitter for question request
    static sendQuestionRequest(socket, colorTile, playerColor) {
      socket.emit('send_question_request', {
        questionColor: colorTile,
        userColor: playerColor
      })
    }
  }
  
export default BoardEvents;