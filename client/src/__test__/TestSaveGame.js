import React from 'react';
import { saveGameProgress } from '../LoadGame/GameSaver'; // Make sure this path points to your GameSaver.js file

function TestSaveGame() {
    // Function to save game data when button is clicked
    const handleSaveGame = () => {
        // Sample roomCode and gameData
        const roomCode = "testRoom123";
        const gameData = {
            player1: "Alice",
            score: 150,
            level: 3
        };

        // Call the saveGameProgress function
        saveGameProgress(roomCode, gameData);
    };

    return (
        <div>
            <h1>Test Save Game</h1>
            <button onClick={handleSaveGame}>Save Game</button>
        </div>
    );
}

export default TestSaveGame;