const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

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

app.post('/save-game', (req, res) => {
    const { roomCode, gameData } = req.body;

    // Write gameData to JSON file (optional)
    fs.writeFile(filePath, JSON.stringify(gameData, null, 2), 'utf-8', (err) => {
        if (err) {
            console.error('Error updating GameSave.json:', err);
            res.status(500).json({ error: 'Failed to update JSON file' });
            return;
        }
        console.log('GameSave.json updated successfully');

        // Insert or update game data in the MySQL table
        const query = `
            INSERT INTO gamesaves (room_code, game_data)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                game_data = VALUES(game_data)
        `;

        // Insert JSON data as a string in the game_data column
        connection.query(query, [roomCode, JSON.stringify(gameData)], (error) => {
            if (error) {
                console.error("Failed to save game state:", error);
                res.status(500).json({ error: 'Failed to save game state' });
                return;
            }
            res.json({ message: 'Game state saved successfully' });
        });
    });
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
