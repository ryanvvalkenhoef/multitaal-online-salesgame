import { useNavigate } from "react-router-dom";

class ModSettings {

  constructor(setPlayerCount, setRoundsCount) {
    this.setPlayerCount = setPlayerCount;
    this.setRoundsCount = setRoundsCount;
  }

  createRoom = () => {
    socket.emit("create_room", { playerCount, roundsCount });
  };

  handleGame = () => {
    useNavigate("/Gamepin");
  };

  handleHome = () => {
    useNavigate("/home");
  };

  decrementPlayerCount = () => {
    if (playerCount > 2) {
      setPlayerCount(playerCount - 1);
    }
  };

  incrementPlayerCount = () => {
    if (playerCount < 6) {
      setPlayerCount(playerCount + 1);
    }
  };

  decrementRoundsCount = () => {
    if (roundsCount > 3) {
      setRoundsCount(roundsCount - 1);
    }
  };

  incrementRoundsCount = () => {
    if (roundsCount < 30) {
      setRoundsCount(roundsCount + 1);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    createRoom();
    handleGame();
  };

  
}

export default ModSettings;
