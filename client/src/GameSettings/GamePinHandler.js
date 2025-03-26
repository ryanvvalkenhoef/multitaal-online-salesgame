import { socket } from "../client.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

class GamePinHandler {
    
      static instance = null;

      constructor() {
          if (!GamePinHandler.instance) {
              this.state = {
                  playerCount: 0,
                  playerNeeded: 0,
                  gamepin: "",
                  errorCode: "‎ ",
                };
                this.setState = null;
              GamePinHandler.instance = this;
          }
          return GamePinHandler.instance;
      }

      setGamePin(gamepin) {
        if (this.setState) {
          this.setState((prevState) => ({ ...prevState, gamepin }));
        }
      }
    
      setPlayerCount(update) {
        if (this.setState) {
          this.setState((prevState) => ({
            ...prevState,
            playerCount: typeof update === "function" ? update(prevState.playerCount) : update,
          }));
        }
      }
    
      setPlayerNeeded(count) {
        if (this.setState) {
          this.setState((prevState) => ({ ...prevState, playerTotal: count }));
        }
      }
    
      connectState(setStateFunction) {
        this.setState = setStateFunction;
      }

      handleGame = (navigate) => {
        if (this.state.playerCount === this.state.playerNeeded) {
          socket.emit("start_turn", "data");
          navigate("/modview");
          sessionStorage.setItem("socketId", socket.id);
          sessionStorage.setItem("room", this.state.gamepin);
        } else {
          this.setErrorCode(`Not all players have joined`);
        }
      };
    
      handlePlayerCountChange = (event) => {
        this.setPlayerCount(parseInt(event.target.value));
      };
    
      copygamepin = (event) => {
        event.target.select();
        document.execCommand("copy");
        // alert('copied gamepin');
      };

}

export default GamePinHandler;