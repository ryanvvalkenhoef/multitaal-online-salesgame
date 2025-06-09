

export const handleReceivePlayerAnswer = ({ socket, reviewQuestion }) => {
  socket.on("receive_player_answer", (questionData) => {
    //parameter is an object
    console.log('question reviewed');
    reviewQuestion(questionData);
  });
};

export const handleRoundFinished = ({ socket, setIsDisabled }) => {
  socket.on("is_next_round_button_disabled", (boolean) => {
    setIsDisabled(boolean);
  });
};

export const cleanUpSocketListeners = (socket) => {
  const events = [
    "send_tileInfo",
    "send_tileInfo2",
    "add_player_color",
    "add_piece",
    "rounds",
    "update_leaderboard",
    "receive_player_answer",
    "game_over",
    "is_next_round_button_disabled",
  ];
  events.forEach((event) => socket.off(event));
};

export {
  handleColorAddition,
  handlePieceAddition,
  handleTileInfo2Update,
  handleTileInfoUpdate,
  handlePositionsUpdate,
  handleUpdateRound,
  handleGameOverEvent,
  handleLeaderBoardUpdate,
  handleGoToHomeScreen,
} from "../../modules/playerModule/PlayerEvents";
