class PlayerState {
    constructor(setPlayersAnsweringQuestion, setPlayersFinishedTurn, setPlayersReviewed, socket) {
      this.playersAnsweringQuestion = [];
      this.playersFinishedTurn = [];
      this.playersReviewed = [];
  
      // React state setters
      this.setPlayersAnsweringQuestion = setPlayersAnsweringQuestion;
      this.setPlayersFinishedTurn = setPlayersFinishedTurn;
      this.setPlayersReviewed = setPlayersReviewed;
  
      this.socket = socket; // Save socket in class
    }
  
    initSocketListeners() {
      this.handleSocketEvent("player_is_answering");
      this.handleSocketEvent("player_has_finished_turn");
      this.handleSocketEvent("player_has_been_reviewed");
      this.handleSocketEvent("reset_player_progress_styles");
    }
  
    updatePlayerState(playerId, stateList, condition) {
      if (condition) {
        if (!stateList.includes(playerId)) {
          stateList.push(playerId);
        }
      } else {
        const index = stateList.indexOf(playerId);
        if (index !== -1) {
          stateList.splice(index, 1);
        }
      }
      return [...stateList]; // Nieuwe array retourneren voor state-updates
    }
  
    handleSocketEvent(event) {
      this.socket.on(event, (data) => {
        if (event === "player_is_answering") {
          this.playersAnsweringQuestion = this.updatePlayerState(
            data.playerId,
            this.playersAnsweringQuestion,
            data.isAnsweringQuestion
          );
        } else if (event === "player_has_finished_turn") {
          this.playersFinishedTurn = this.updatePlayerState(
            data.playerId,
            this.playersFinishedTurn,
            data.hasFinishedTurn
          );
          if (data.hasFinishedTurn) {
            this.playersAnsweringQuestion = this.updatePlayerState(
              data.playerId,
              this.playersAnsweringQuestion,
              false
            );
          }
        } else if (event === "player_has_been_reviewed") {
          this.playersReviewed = this.updatePlayerState(
            data.playerId,
            this.playersReviewed,
            data.hasBeenReviewed
          );
          if (data.hasBeenReviewed) {
            this.playersFinishedTurn = this.updatePlayerState(
              data.playerId,
              this.playersFinishedTurn,
              false
            );
          }
        } else if (event === "reset_player_progress_styles") {
          this.resetPlayerStates();
          this.updateUI();
          return;
        }
  
        this.updateUI();
      });
    }
  
    resetPlayerStates() {
      this.playersAnsweringQuestion = [];
      this.playersFinishedTurn = [];
      this.playersReviewed = [];
    }
  
    updateUI() {
      this.setPlayersAnsweringQuestion([...this.playersAnsweringQuestion]);
      this.setPlayersFinishedTurn([...this.playersFinishedTurn]);
      this.setPlayersReviewed([...this.playersReviewed]);
    }
}

export default PlayerState;