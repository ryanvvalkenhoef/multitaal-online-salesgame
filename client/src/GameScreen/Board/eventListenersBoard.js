
const handleValidPositionsUpdate = (socket, setValidPositions) => {
    socket.on("update_valid_positions", (validPositionsArray) => {
        setValidPositions(validPositionsArray);
    });
};

const handlePositionsUpdate = (socket, validPositions) => {
    socket.on("update_piece_positions", (newPositionData) => {

        newPositionData.forEach((data) => {
            const newPosition = data.newPosition;
            const selectedPawnName = data.selectedPawn;
            const selectedPawnElement = document.getElementById(selectedPawnName);

            if (selectedPawnElement) {
                const newTile = document.querySelector(`.tile[data-pos="${newPosition}"]`);
                newTile.appendChild(selectedPawnElement);
                document.querySelectorAll(".tile").forEach((tile) => tile.classList.remove("blink"));
            }
        });
    });
};


const cleanUpSocketListeners = (socket) => {
    socket.off("update_valid_positions");
    socket.off("update_piece_positions");

};


module.exports = {
    handleValidPositionsUpdate,
    handlePositionsUpdate,
    cleanUpSocketListeners,
}