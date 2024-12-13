const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

// Pad naar de GameSave.json
const filePath = path.join(__dirname, 'gameSaves', 'GameSave.json');

// MySQL verbinding
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});

// Verbind met de database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Functie om GameSave.json te updaten
const updateGameSaveFile = (gameState) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const gameSave = JSON.parse(data);

        gameSave.players.forEach((player, index) => {
            player.points = gameState.players[index].points;
            player.position = gameState.players[index].position;
            player.turn = gameState.players[index].turn;
        });

        gameSave.leaderboard = gameState.leaderboard;
        gameSave.currentTurn = gameState.currentTurn;

        fs.writeFileSync(filePath, JSON.stringify(gameSave, null, 2), 'utf-8');
        console.log('GameSave.json updated successfully');
    } catch (error) {
        console.error('Error updating GameSave.json:', error);
    }
};

// Functie om game progress op te slaan in de database
const saveGameProgressToDatabase = (gameSave) => {
    if (!gameSave.roomCode || typeof gameSave.roomCode !== 'string') {
        console.error("Invalid roomCode:", gameSave.roomCode);
        return;
    }

    console.log("Room code:", gameSave.roomCode);
    console.log("Game save data:", JSON.stringify(gameSave));

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

// Functie om game progress te laden uit de database
const loadGameProgressFromDatabase = (roomCode, callback) => {
    if (!roomCode || typeof roomCode !== 'string') {
        console.error("Invalid roomCode for loading game data:", roomCode);
        callback(new Error('Invalid roomCode'), null);
        return;
    }

    console.log("Loading game data for roomCode:", roomCode);

    const query = 'SELECT game_data FROM gamesaves WHERE room_code = ?';

    connection.query(query, [roomCode], (error, results) => {
        if (error) {
            console.error("Error loading game state:", error);
            callback(error, null);
            return;
        }

        if (results.length === 0) {
            console.log('No game data found for roomCode:', roomCode);
            callback(new Error('Game state not found'), null);
            return;
        }

        const gameData = JSON.parse(results[0].game_data);
        console.log("Game data loaded successfully:", gameData);
        callback(null, gameData);
    });
};

// Debug: Extra logging bij het exporteren
console.log("Exporting functions: updateGameSaveFile, saveGameProgressToDatabase, loadGameProgressFromDatabase");

// Exporteer de functies
module.exports = {
    updateGameSaveFile,
    saveGameProgressToDatabase,
    loadGameProgressFromDatabase
};
