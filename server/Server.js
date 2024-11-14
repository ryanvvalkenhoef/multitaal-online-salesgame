const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the path to GameSave.json
const filePath = path.join(__dirname, 'gameSaves', 'GameSave.json');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(bodyParser.json());

// Function to update GameSave.json file with the current game state
const updateGameSaveFile = (gameState) => {
    // Read the existing JSON file
    const data = fs.readFileSync(filePath, 'utf-8');
    const gameSave = JSON.parse(data);

    // Update players, leaderboard, and current turn in the JSON data
    gameSave.players.forEach((player, index) => {
        player.points = gameState.players[index].points;
        player.position = gameState.players[index].position;
        player.turn = gameState.players[index].turn;
    });

    gameSave.leaderboard = gameState.leaderboard;
    gameSave.currentTurn = gameState.currentTurn;

    // Write the updated JSON data back to GameSave.json
    fs.writeFileSync(filePath, JSON.stringify(gameSave, null, 2), 'utf-8');
    console.log('GameSave.json updated successfully');
};

// Function to save game data to the database
const saveGameProgressToDatabase = (gameSave) => {
    const sql = `
        INSERT INTO gamesaves (room_code, game_data)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            game_data = VALUES(game_data)
    `;

    const values = [
        gameSave.roomCode,
        JSON.stringify(gameSave)
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error saving game data to database:", err);
        } else {
            console.log("Game data saved to database successfully:", result);
        }
    });
};

// Endpoint to save game state
app.post('/save-game', (req, res) => {
    const { roomCode, gameData } = req.body;

    // Update GameSave.json with the new game state
    updateGameSaveFile(gameData);

    // Save game state to the database
    saveGameProgressToDatabase({ roomCode, ...gameData });

    res.json({ message: 'Game state saved successfully' });
});

// Endpoint to load game state
app.get('/load-game/:roomCode', (req, res) => {
    const { roomCode } = req.params;

    // Query to retrieve the game state from the gamesaves table
    const query = 'SELECT game_data FROM gamesaves WHERE room_code = ?';

    connection.query(query, [roomCode], (error, results) => {
        if (error) {
            console.error("Error loading game state:", error);
            res.status(500).json({ error: 'Failed to load game state' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Game state not found' });
            return;
        }

        // Parse game_data and send it as JSON
        const gameData = JSON.parse(results[0].game_data);
        res.json(gameData);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});