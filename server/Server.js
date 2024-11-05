const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

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

// Endpoint to save game state
app.post('/save-game', (req, res) => {
    const { roomCode, gameData } = req.body;

    // Query to insert or update the game state in the gamesaves table
    const query = `
    INSERT INTO gamesaves (room_code, game_data)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE game_data = VALUES(game_data)
  `;

    connection.query(query, [roomCode, JSON.stringify(gameData)], (error) => {
        if (error) {
            res.status(500).json({ error: 'Failed to save game state' });
            return;
        }
        res.json({ message: 'Game state saved successfully' });
    });
});

// Endpoint to load game state
app.get('/load-game/:roomCode', (req, res) => {
    const { roomCode } = req.params;

    // Query to retrieve the game state from the gamesaves table
    const query = 'SELECT game_data FROM gamesaves WHERE room_code = ?';

    connection.query(query, [roomCode], (error, results) => {
        if (error || results.length === 0) {
            res.status(404).json({ error: 'Game state not found' });
            return;
        }

        const gameData = JSON.parse(results[0].game_data);
        res.json(gameData);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
