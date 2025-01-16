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

  // Update GameSave.json met de nieuwe game state
  updateGameSaveFile(gameData);

  // Sla game state op in de database
  saveGameProgressToDatabase({ roomCode, ...gameData });

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
