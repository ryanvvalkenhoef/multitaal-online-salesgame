import { useNavigate } from "react-router-dom";
import "./GamePinStyle.css";
import { socket } from "../client.js";
import React, { useEffect, useState } from "react";
import back from "../Assets/back-button.png";
import { useTranslation } from "react-i18next";
import den_flag from "../Assets/den_flag.png";
import uk_flag from "../Assets/uk_flag.png";
import nl_flag from "../Assets/nl_flag.png";
import { useLanguageManager } from "../Translations/LanguageManager.js";
import GamePinHandler from "../GameSettings/GamePinHandler.js";

export function GamePin() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();
  const [gamePinState, setGamePinState] = useState({
    gamepin: "",
    playerCount: 0,
    playerTotal: 0,
  });

  const gamePinHandler = new GamePinHandler();
  gamePinHandler.connectState(setGamePinState);

  const handleHome = () => {
    navigate("/home");
    socket.emit("delete_mod", "data");
  };

  const handleBack = () => {
    navigate("/configuration");
    socket.emit("delete_mod", "data");
  };

  const handleStartGame = () => {
    gamePinHandler.handleGame(navigate);
  };

  useEffect(() => {
    // Add event listeners
    socket.on("send_gamepin", (data) => {
      console.log(data.room);
      gamePinHandler.setGamePin(data.room);
      console.log("sending game pin:, data.room ");
      gamePinHandler.setPlayerNeeded(data.playerTotal);
    });
    socket.on("add_user", () => {
      console.log("being added");
      gamePinHandler.setPlayerCount((prevCount) => prevCount + 1);
    });
    socket.on("delete_user", () => {
      gamePinHandler.setPlayerCount((prevCount) => prevCount - 1);
    });
  
    // Cleanup-function to remove all listeners
    return () => {
      socket.off("send_gamepin");
      socket.off("add_user");
      socket.off("delete_user"); // Add to remove all event listeners
    };
  }, []); // Only at mount/unmount

  return (
    <div className="parent-container-gamepin">
      <button className="Qbutton" onClick={handleGuide}>
        ?
      </button>
      <button className="Home" type="button" onClick={handleBack}>
        <img src={back} alt="Home" className="home-image" />
      </button>
      <div className="gamepinGamepin">
        <label className="gamepinLabel">{t("GamePin.gamepin")}</label>
        <input
          type="text"
          className="gamepinGenerate"
          value={gamePinState.gamepin}
          onClick={gamePinHandler.copygamepin}
          readOnly
          onChange={(event) => gamePinHandler.setGamePin(event.target.value)}
        />
      </div>
      <div className="playersJoinedGamepin">
        <label className="gamepinLabel">{t("GamePin.players")}</label>
        <input
          id="playerCount"
          name="playerCount"
          className="joinedPlayers"
          value={gamePinState.playerCount}
          readOnly
          onChange={gamePinHandler.handlePlayerCountChange}
        />
      </div>
      <div className="buttonGamePin">
        <button type="submit" className="gamePinButton" onClick={handleStartGame}>
          {" "}
          {t("GamePin.start")}{" "}
        </button>
      </div>
      <div className="errorGamepin">{gamePinHandler.errorCode}</div>
      <div className="languageRow">
        <img
          className="flagImg4"
          id="DEN"
          src={den_flag}
          alt="Danish"
          onClick={() => handleChangeLanguage("dk")}
        />
        <img
          className="flagImg4"
          id="EN"
          src={uk_flag}
          alt="English"
          onClick={() => handleChangeLanguage("en")}
        />
        <img
          className="flagImg4"
          id="NL"
          src={nl_flag}
          alt="Dutch"
          onClick={() => handleChangeLanguage("nl")}
        />
      </div>
    </div>
  );
}
