export const handleTileInfoUpdate = ({ socket, setTileInfo }, callback) => {
  socket.on("send_tileInfo", (data) => {
    setTileInfo(data);
    callback(data);
  });
};

export const handleTileInfo2Update = ({ socket, setTileInfo2 }, callback) => {
  socket.on("send_tileInfo2", (data) => {
    setTileInfo2(data);
    callback(data);
  });
};

export const handleColorAddition = ({ socket, setJoinedColors }, callback) => {
  socket.on("add_player_color", (strategies) => {
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
    callback(joinedColorsArray);
  });
};

export const handlePieceAddition = ({ socket, setStartPieces }, callback) => {
  socket.on("add_piece", (strategies) => {
    setStartPieces(strategies);
    callback(strategies);
  });
};

export const handleCurrentPlayerRegistration = ({
  socket,
  setCurrentPlayer,
  setPlayerColor,
}) => {
  socket.on("register_current_player", (data) => {
    setCurrentPlayer(data.strategy);
    setPlayerColor(data.color);
  });
};

export const handleUpdateRound = ({ socket, setRoundText, t }) => {
  socket.on("rounds", (data) => {
    setRoundText(t("Game.setRoundText", { data }));
  });
};

export const handleNameUpdate = ({ socket, setPlayerName }) => {
  socket.on("player_names", (data) => {
    setPlayerName(data);
    //setTurnText(t("Game.setTurnText", { data }))
  });
};

export const handleLeaderBoardUpdate = ({ socket, setData }) => {
  socket.on("update_leaderboard", (jsonData) => {
    console.log("leaderbord update");
    setData(jsonData);
  });
};

export const handleReceivingQuestion = ({
  socket,
  currentQuestionRef,
  setPopupColor,
  setQuestion,
  setIsPopUpEnabled,
}) => {
  socket.on("receive_question", (data) => {
    currentQuestionRef.current = data;
    setPopupColor(data.questionColor);
    setQuestion(data.questionText);
    setIsPopUpEnabled(true);
  });
};

export const handleDisablingWaitingScreen = ({
  socket,
  setIsWaitingScreenEnabled,
}) => {
  socket.on("disable_waiting_screen", (data) => {
    setIsWaitingScreenEnabled(false);
  });
};

export const handlePlayerTurnUpdate = ({
  socket,
  setPosition,
  setSelectedPawn,
}) => {
  socket.on("players_turn", (strategy) => {
    //naam van event moet veranderd worden
    try {
      const pawn = document.querySelector("#" + strategy);
      // console.log("Pawn: " + pawn)
      // console.log(pawn)
      // const parent = pawn.parentElement
      // console.log('Parent: ' + parent)
      // console.log(parent)
      // const parentPosition = parent.getAttribute('data-pos')
      // console.log("parentPosition: " + parentPosition)
      //
      //
      // setPosition(parentPosition)
      // console.log('game', parentPosition)
      setSelectedPawn(pawn);
    } catch (TypeError) {
      socket.emit("pawns_request_failed", "");
    }
  });
};

export const handleTurnStatusUpdate = ({ socket, setMyTurn }) => {
  socket.on("set_turn_true", () => {
    setMyTurn(true);
  });
};

export const handlePositionsUpdate = ({ socket, setPiecePositions }) => {
  socket.on("update_piece_positions", (positions) => {
    setPiecePositions(positions);
  });
};

export const handleSetPosition = ({ socket, setPosition }) => {
  socket.on("set_player_position", (position) => {
    setPosition(position);
  });
};

export const handleGameOverEvent = ({ socket, navigate }) => {
  socket.on("game_over", () => {
    console.log("game over");
    navigate("/results");
  });
};

export const handleSetRollDice = ({ socket, setPlayerRollDice }) => {
  socket.on("set_roll_dice", (boolean) => {
    setPlayerRollDice(boolean);
  });
};

export const handleGoToHomeScreen = ({ socket, navigate }) => {
  socket.on("go_to_home_screen", () => {
    navigate("/home");
  });
};

export const cleanUpSocketListeners = (socket) => {
  const events = [
    "send_tileInfo",
    "send_tileInfo2",
    "add_player_color",
    "add_piece",
    "rounds",
    "player_names",
    "update_leaderboard",
    "receive_question",
    "disable_waiting_screen",
    "players_turn",
    "update_piece_positions",
    "set_turn_true",
    "go_to_home_screen",
    "game_over",
  ];
  events.forEach((event) => socket.off(event));
};
