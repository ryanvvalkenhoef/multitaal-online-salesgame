
const handleValidPositionsUpdate = (socket, setValidPositions) => {
    socket.on("update_valid_positions", (validPositionsArray) => {
        console.log("In valid positions update event")
        setValidPositions(validPositionsArray);
    });
};

const handlePositionsUpdate = (socket, validPositions) => {
    socket.on("update_piece_position", (newPositionData) => {
        console.log("data: " + JSON.stringify(newPositionData))
        newPositionData.forEach((data) => {
            const newPosition = data.newPosition;
            const selectedPawnName = data.selectedPawn;
            const selectedPawnElement = document.getElementById(selectedPawnName);
            console.log("hoooi: " + data.newPosition);

            if (selectedPawnElement) {
                const newTile = document.querySelector(`.tile[data-pos="${newPosition}"]`);
                newTile.appendChild(selectedPawnElement);
                document.querySelectorAll(".tile").forEach((tile) => tile.classList.remove("blink"));
            }
        });
    });
};

// const handlePositionsUpdate = ({socket,setPiecePositions}) => {
//     socket.on('update_piece_position',(positions)=>{
//         console.log("possssities");
//         console.log(JSON.stringify(positions));
//         setPiecePositions(positions);
//     })
//
// }

// const handlePositionUpdate = (socket, validPositions) => {
//     socket.on("update_piece_position", (newPositionData) => {
//         console.log("data: " + JSON.stringify(newPositionData))
//         newPositionData.forEach((data) => {
//             const newPosition = data.newPosition;
//             const selectedPawnName = data.selectedPawn;
//             const selectedPawnElement = document.getElementById(selectedPawnName);
//             console.log(validPositions.includes(newPosition));
//
//             if (selectedPawnElement) {
//                 const newTile = document.querySelector(`.tile[data-pos="${newPosition}"]`);
//                 newTile.appendChild(selectedPawnElement);
//                 document.querySelectorAll(".tile").forEach((tile) => tile.classList.remove("blink"));
//             }
//         });
//     });
// };


const cleanUpSocketListeners = (socket) => {
    socket.off("update_valid_positions");
    socket.off("update_piece_position");

};


module.exports = {
    handleValidPositionsUpdate,
    handlePositionsUpdate,
    cleanUpSocketListeners,
}