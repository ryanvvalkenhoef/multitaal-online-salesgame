const handleTileInfoUpdate = (socket, setTileInfo, func) => {
    socket.on("send_tileInfo", (data) => {
        console.log('tile info1 event')
        setTileInfo(data);
        func(data);
        console.log("getttting tile infffooooo")
    });
};

const handleTileInfo2Update = (socket, setTileInfo2,func) => {
    socket.on("send_tileInfo2", (data) => {
        setTileInfo2(data);
        func(data);
    });
};

const handleValidPositionsUpdate = (socket, setValidPositions) => {
    socket.on("update_valid_positions", (validPositionsArray) => {
        setValidPositions(validPositionsArray);
    });
};

const handlePieceAddition = (socket, setStartPieces, func) => {
    socket.on("add_piece", (strategies) => {
        console.log('strategies in event: ' , strategies)
        console.log("HandlePiecaddition")
        setStartPieces(strategies);
        func(strategies);

    });
};

const handleColorAddition = (socket,setJoinedColors,func) =>{
    socket.on('add_player_color', (strategies)=>{
        console.log('color additon event')
        let joinedColorsArray = [];
        const colorMap = {
            world: "green",
            lunar: "yellow",
            domino: "blue",
            jysk: "orange",
            klaphatten: "purple",
            safeline: "red",
        };

        strategies.forEach((strategy) => {
            if (colorMap[strategy]) {
                joinedColorsArray.push(colorMap[strategy]);
            }
        });

        setJoinedColors(joinedColorsArray);
        func(joinedColorsArray);
    })
}

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
    socket.off("add_player_color");
    socket.off('add_piece')

};


module.exports = {
    handleTileInfoUpdate,
    handleTileInfo2Update,
    handleValidPositionsUpdate,
    handlePieceAddition,
    handlePositionUpdate,
    handleCurrentPlayerRegistration,
    cleanUpSocketListeners,
    handleColorAddition
}