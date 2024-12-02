
const handleValidPositionsUpdate = (socket, setValidPositions) => {
    socket.on("update_valid_positions", (validPositionsArray) => {
        console.log("In valid positions update event")
        setValidPositions(validPositionsArray);
    });
};


const handlePositionUpdate = (socket, validPositions) => {
    socket.on("update_position", (newPositionData) => {
        console.log("data: " + JSON.stringify(newPositionData))
        newPositionData.forEach((data) => {
            const newPosition = data.newPosition;
            const selectedPawnName = data.selectedPawn;
            const selectedPawnElement = document.getElementById(selectedPawnName);
            console.log(validPositions.includes(newPosition));

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
    socket.off("update_position");

};


module.exports = {
    handleValidPositionsUpdate,
    handlePositionUpdate,
    cleanUpSocketListeners,
}