const { log } = require("console");
const { json } = require("express");
const fs = require("fs");
const { get } = require("http");


function createJsonfile(room){
    fs.writeFileSync(
        `gameSaves/${room}data.json`,
        '{\n  "users": [],\n  "mod": {},\n "questionQueue": []\n }'
      );
}

function getMod(room){
    let data = readData(room);
    if (!data) {
        console.log("Cant find mod");
        return null;
    }
    return data.mod;
}

function generateGamepin() {
  const characters = "01234A5S678T9M";
  const length = 5;
  let pin = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    pin += characters[randomIndex];
  }
  return pin;
}

const readData = (room) => {
  try {
    
    const data = fs.readFileSync(`gameSaves/${room}data.json`, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return null;
  }
};

const writeData = (jsonData,room) => {
  try {
    fs.writeFileSync(`gameSaves/${room}data.json`, JSON.stringify(jsonData, null, 2));
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

const deleteMods = (modsId,room) => {
  let data = readData(room);
  if (!data) return;
  data.mod = data.mod.filter((mods) => mods.id !== modsId);
  writeData(data,room);
};

const addMods = (mod,room) => {
    
    
  let data = readData(room);
  if (!data) return;
  data.mod = mod
  writeData(data,room);
};

const updateMods = (modsId, newData,room) => {
  let data = readData(room);
  if (!data) return;
  //const index = data.mod.findIndex((mods) => mods.id === modsId);
  mod = data.mod;
  if (mod) {
    data.mod[index] = { ...data.mod[index], ...newData };
    writeData(data,room);
  } else {
    console.error("Mod not found.");
  }
};

// function getRoom(socketid) {
//   let data = readData(room);
//   if (!data) return null;
//   const mods = data.mod.find((mods) => mods.id === socketid);
//   if (mods) {
//     return mods.room;
//   } else {
//     console.error("Mod(s) not found.");
//     return null;
//   }
// }

const checkRoom = (roomcode,room) => {
  let data = readData(room);
  if (!data) return null;
  const roomExists = data.mod.room === roomcode;
  if (roomExists) {
    return "exists";
  } else {
    return "does not exist";
  }
};

const modID = (room) => {
  let data = readData(room);
  if (!data) return null;
  const modID = data.mod.id;
  if (modID) {
    return modID.id;
  } else {
    console.log("Couldn't find modId");
    return null;
  }
};

const addPlayerToMod = (socketid, strategy,room) => {
  switch (strategy) {
    case "top of the world":
      strategy = "world";
      break;
    case "jysk telepartner":
      strategy = "jysk";
      break;
    case "domino house":
      strategy = "domino";
      break;
    default:
      strategy = strategy;
      break;
  }
  let data = readData(room);
  if (!data) return null;
  
  
  //for (let i = 0; i < data.mod.length; i++) {
    // if (data.mod[i].id === socketid) {
    data.mod.players_joined.push(strategy);
    writeData(data,room);
    return "added";
 // }
};
//}

const addPlayerNameToMod = (socketid, name,room) => {
  let data = readData(room);
  if (!data) return null;
  for (let i = 0; i < data.mod.length; i++) {
    data.mod.player_names.push(name);
    writeData(data,room);
    return "added";
  }
};


const nextRound = (room) => {
  const data = readData(room)
  data.mod.current_round += 1;
  writeData(data,room);
};

const getPlayerTurn = (socketid,room) => {
  const mod = getMod(room);
  if (!mod){
    console.log("Can't find mod");
    return null;
  }
  return mod.players_joined;

};

const getPieces = (room) => {
    let playerPieces = [];
      try {
        const strategies = readData(room).mod.players_joined;
        for (let i = 0; i < strategies.length; i++) {
          playerPieces.push(strategies[i]);
        }
      } catch (TypeError) {
        playerPieces = "No players found";
      }
      return playerPieces;
}

const getPlayerNames = (socketid,room) => {
  
  const mod = getMod(room);
  if (!mod) return null;
  const playerArray = mod.player_names;
  const turn = mod.turn;
  if (typeof turn !== "number" || turn < 0 || turn >= playerArray.length)
    return null;

  return playerArray;
};

const getRound = (socketid,room) => {
  const mod = getMod(room);
  if (!mod) return null;
  return { currentRound: mod.current_round, totalRounds: mod.total_rounds };
};

const getPlayerTotal = (room) => {
  const mod = getMod(room);
  if (!mod) return null;
  return mod.total_players;
};

const checkFull = (room) => {
  const mod = getMod(room);
  if (!mod) return null;
  
  if (mod.players_joined.length >= mod.total_players) {
    return "full";
  } else {
    return "space";
  }
};
const removeUserFromMod = (info,room) => {
  let data = readData(room);
  if (!data) return null;
  try {
    const mod = data.mod;
    const index = mod.player_names.findIndex((name) => name === info.name);
    mod.player_names.splice(index, 1);
    mod.players_joined.splice(index, 1);
    writeData(data,room);
  } catch (error) {
    return null;
  }
};

const getPlayersList = (room) => {
  let data = readData(room);
  if (!data) {
    console.log("Can't read data: getPlayersList()");
    return null;
  }
  return data.users;
};

const checkIfRoundIsFinished = (room) => {
  let data = readData(room);

  if (!data) {
    console.log("Can't read data: checkIfRoundIsFinished()");
    return null;
  }

  const playerCount = data.mod.total_players;

  for (let i = 0; i < playerCount; i++) {
    const hasFinishedTurn = data.users[i].hasFinishedTurn;
    if (!hasFinishedTurn) {
      return false;
    }
  }
  data.mod.isRoundFinished = true;
  writeData(data,room);
  return true;
};

const resetRoundStatus = (room) => {
  let data = readData(room);

  if (!data) {
    console.log("Can't read data: resetRoundStatus()");
    return null;
  }

  data.mod.isRoundFinished = false;
  writeData(data,room);
};

const getNumberOfQuestionsReviewed = (room) => {
  const data = readData(room);

  if (!data) {
    console.log("Can't read data: getNumberOfQuestionsReviewed()");
    return null;
  }
  return data.mod[0].numberOfQuestionsReviewed;
};

const resetNumberOfQuestionsReviewed = (room) => {
  const data = readData(room);

  if (!data) {
    console.log("Can't read data: resetNumberOfQuestionsReviewed()");
    return null;
  }
  data.mod.numberOfQuestionsReviewed = 0;
  writeData(data,room);
};

const updateNumberOfQuestionsReviewed = (room) => {
  const data = readData(room);

  if (!data) {
    console.log("Can't read data: updateNumberOfQuestionsReviewed()");
    return null;
  }
  data.mod.numberOfQuestionsReviewed++;
  writeData(data,room);
};

const setIsReviewingQuestion = (boolean,room) => {
  const data = readData(room);

  if (!data) {
    console.log("Can't read data: setIsReviewingQuestion()");
    return null;
  }
  data.mod.isReviewingQuestion = boolean;
  writeData(data,room);
};

const checkIfReviewingQuestion = (room) => {
  const data = readData(room);

  if (!data) {
    console.log("Can't read data: checkIfReviewingQuestion()");
    return null;
  }
  return data.mod.isReviewingQuestion;
};

function modLogger(room,method, socketid, info = "temp") {
  switch (method) {
    case "log":
      const gamepin = generateGamepin();
      createJsonfile(gamepin);
      addMods({
        id: socketid,
        language: "NL",
        room: gamepin,
        player_names: [],
        players_joined: [],
        total_players: info.playerCount,
        current_round: 1,
        total_rounds: info.roundsCount,
        isRoundFinished: false,
        numberOfQuestionsReviewed: 0,
        isReviewingQuestion: false,
      },gamepin);
      return gamepin;
    case "delete":
      deleteMods(socketid);
      break;
    case "checkExists":
      const exists = checkRoom(info,room);
      return exists;
    case "getRoom":
      const roomCode = generateGamepin();
      addMods(socketid,room);
      updateMods(socketid, { room: roomCode },room);
      return roomCode;
    case "getMod":
      return modID(room);
    case "addPlayer":
      addPlayerToMod(socketid, info,room);
      break;
    case "getPieces":
      return getPieces(room);
    // case "room":
    //   const room = readData(so).mods.find((mod) => mod.id === socketid).room;
    //   return room;
    case "nextRound":
      nextRound(room);
      break;
    case "getPlayerTurn":
      return getPlayerTurn(socketid,room);
    case "addPlayerName":
      addPlayerNameToMod(socketid, info,room);
      break;
    case "getPlayerNames":
      return getPlayerNames(socketid,room);
    case "getRound":
      return getRound(socketid,room);
    case "getPlayerTotal":
      return getPlayerTotal(room);
    case "checkFull":
      return checkFull(room);
    case "removeUser":
      removeUserFromMod(info,room);
      break;
    case "getPlayersList":
      return getPlayersList(room);
    case "checkIfRoundIsFinished":
      return checkIfRoundIsFinished(room);
    case "resetRoundStatus":
      resetRoundStatus(room);
      break;
    case "readData":
      return readData(room);
    case "writeData":
      writeData(info,room);
      break;
    case "getNumberOfQuestionsReviewed":
      return getNumberOfQuestionsReviewed(room);
    case "resetNumberOfQuestionsReviewed":
      resetNumberOfQuestionsReviewed(room);
      break;
    case "updateNumberOfQuestionsReviewed":
      updateNumberOfQuestionsReviewed(room);
      break;
    case "setIsReviewingQuestion":
      setIsReviewingQuestion(info,room);
      break;
    case "checkIfReviewingQuestion":
      return checkIfReviewingQuestion(room);
  }
}

module.exports = modLogger;
