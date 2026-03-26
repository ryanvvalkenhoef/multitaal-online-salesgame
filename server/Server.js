const express = require("express");
const bodyParser = require("body-parser");
const {
  updateGameSaveFile,
  saveGameProgressToDatabase,
  loadGameProgressFromDatabase,
} = require("./save-Game");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint om game state op te slaan
app.post("/save-game", (req, res) => {
  const { roomCode, gameData } = req.body;

  if (!roomCode) {
        return res.status(400).json({ message: "Geen roomCode ontvangen" });
    }

    // Maak een object dat matcht met wat saveGameProgressToDatabase verwacht
    const dataToSave = {
        roomCode: roomCode,
        ...gameData // Hier zitten de players, position, etc. in
    };

    // DIT IS DE CRUCIALE STAP:
    saveGameProgressToDatabase(dataToSave);

  res.json({ message: "Game state saved successfully" });
});

// Endpoint om game state te laden
app.get("/load-game/:roomCode", (req, res) => {
  const { roomCode } = req.params;

  loadGameProgressFromDatabase(roomCode, (error, gameData) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(gameData);
  });
});

// Start de server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
