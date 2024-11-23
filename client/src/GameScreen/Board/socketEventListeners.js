const handleTileInfoUpdate = (socket, setTileInfo) => {
    socket.on("send_tileInfo", (data) => {
        setTileInfo(data);
        console.log("getttting tile infffooooo")
    });
};

const handleTileInfo2Update = (socket, setTileInfo2) => {
    socket.on("send_tileInfo2", (data) => {
        setTileInfo2(data);
    });
};

const handleValidPositionsUpdate = (socket, setValidPositions) => {
    socket.on("update_valid_positions", (validPositionsArray) => {
        setValidPositions(validPositionsArray);
    });
};

const handlePieceAddition = (socket, setStartPieces, setJoinedColors) => {
    socket.on("add_piece", (strategies) => {
        let joinedColorsArray = [];
        const colorMap = {
            world: "green",
            lunar: "yellow",
            domino: "blue",
            jysk: "orange",
            klaphatten: "purple",
            safeline: "red",
        };
        console.log('strategies in event: ' , strategies)
        strategies.forEach((strategy) => {
            if (colorMap[strategy]) {
                joinedColorsArray.push(colorMap[strategy]);
            }
        });
        console.log("HandlePiecaddition")
        setStartPieces(strategies);
        setJoinedColors(joinedColorsArray);
    });
};

const handlePositionUpdate = (socket, validPositions, setPosition) => {
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
                setPosition(newPosition);
                document.querySelectorAll(".tile").forEach((tile) => tile.classList.remove("blink"));
            }
        });
    });
};

const handleCurrentPlayerRegistration = (socket, setCurrentPlayer, setPlayerColor) => {
    socket.on("register_currentplayer", (data) => {
        setCurrentPlayer(data.strategy);
        setPlayerColor(data.color);
    });
};

const cleanUpSocketListeners = (socket) => {
    socket.off("send_tileInfo");
    socket.off("send_tileInfo2");
    socket.off("update_valid_positions");
    socket.off("register_currentplayer");
    socket.off("update_position");
};


module.exports = {
    handleTileInfoUpdate,
    handleTileInfo2Update,
    handleValidPositionsUpdate,
    handlePieceAddition,
    handlePositionUpdate,
    handleCurrentPlayerRegistration,
    cleanUpSocketListeners
}