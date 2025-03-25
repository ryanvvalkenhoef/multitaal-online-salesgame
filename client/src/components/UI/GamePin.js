import { useNavigate } from "react-router-dom";
import "./GamePinStyle.css";
import { socket } from "../../client";
import React, { useEffect, useState } from "react";
import back from "../../Assets/back-button.png";
import { useTranslation } from "react-i18next";
import den_flag from "../../Assets/den_flag.png";
import uk_flag from "../../Assets/uk_flag.png";
import nl_flag from "../../Assets/nl_flag.png";
import { useLanguageManager } from "../../Translations/LanguageManager";
import { handleGame, handleBack, handlePlayerCountChange, copygamepin } from "../../GameSettings/GamePinHandler";

export function GamePin() {
  const [gamepin, setGamepin] = useState("");
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(0);
  const [playerNeeded, setPlayerNeeded] = useState(0);
  const [errorCode, setErrorCode] = useState("‎ ");
  const { t, i18n } = useTranslation("global");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();

  useEffect(() => {
    // Add event listeners
    socket.on("send_gamepin", (data) => {
      setGamepin(data.room);
      console.log("sending game pin:, data.room ");
      setPlayerNeeded(data.playerTotal);
    });
    socket.on("add_user", () => {
      console.log("being added");
      setPlayerCount((prevCount) => prevCount + 1);
    });
    socket.on("delete_user", () => {
      setPlayerCount((prevCount) => prevCount - 1);
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
          value={gamepin}
          onClick={copygamepin}
          readOnly
          onChange={(event) => setGamepin(event.target.value)}
        />
      </div>
      <div className="playersJoinedGamepin">
        <label className="gamepinLabel">{t("GamePin.players")}</label>
        <input
          id="playerCount"
          name="playerCount"
          className="joinedPlayers"
          value={playerCount}
          readOnly
          onChange={handlePlayerCountChange}
        />
      </div>
      <div className="buttonGamePin">
        <button type="submit" className="gamePinButton" onClick={handleGame}>
          {" "}
          {t("GamePin.start")}{" "}
        </button>
      </div>
      <div className="errorGamepin">{errorCode}</div>
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
