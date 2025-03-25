import { socket } from "../client.js";
import { useNavigate } from "react-router-dom";

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
              GamePinHandler.instance = this;
          }
          return GamePinHandler.instance;
      }

      setErrorCode = (errorCode) => {
        this.state.errorCode = errorCode;
      }

      setPlayerCount = (playerCount) => {
        this.state.playerCount = playerCount;
      }

      setPlayerNeeded = (playerNeeded) => {
        this.state.playerNeeded = playerNeeded;
      }

      init(setState) {
          this.setState = setState;
      }

      handleGame = () => {
        if (this.state.playerCount === this.state.playerNeeded) {
          socket.emit("start_turn", "data");
          useNavigate("/modview");
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