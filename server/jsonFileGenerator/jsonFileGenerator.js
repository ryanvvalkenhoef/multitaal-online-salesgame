import fs from "fs";

export const createJsonFile = (room) => {

    const gameStateObject ={
        totalPlayers: 0,
        totalRounds : 0,
        currentRound : 0,
        strategies : [],
        playerNames: [],
        isRoundFinished: false,
    }

    const jsonFile = {
        users : [],
        mod : {},
        gameState: gameStateObject
    }

    fs.writeFileSync(
        `gameSaves/${room}data.json`,
        JSON.stringify(jsonFile),null,2
    );
}

