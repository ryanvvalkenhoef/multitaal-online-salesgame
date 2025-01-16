import { useNavigate } from "react-router-dom";
import "./LoadgameStyle.css";
import React, { useEffect, useState } from "react";
import { socket } from "../client";
import { useTranslation } from "react-i18next";
import home from "../Assets/back-button.png";
import { useLanguageManager } from "../Translations/LanguageManager";
import den_flag from "../Assets/den_flag.png";
import uk_flag from "../Assets/uk_flag.png";
import nl_flag from "../Assets/nl_flag.png";

export function LoadGame() {
  const [gamepin, setGamepin] = useState("");
  const [information, setInformation] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();

  const loadGame = () => {
    if (!gamepin) {
      setInformation("Please enter a room code");
      return;
    }

    socket.emit("load_game", { room: gamepin });
  };

  useEffect(() => {
    socket.on("load_success", (data) => {
      if (data) {
        // Load the game data into ModView.js
        socket.emit("resume_game", { gameData: data });
        navigate("/modview");
      } else {
        setInformation("Game not found.");
      }
    });
  }, [navigate]);

  const handleHome = () => {
    navigate("/home");
  };

  return (
    <div className="parent-container-loadgame">
      <button className="Qbutton" onClick={handleGuide}>
        ?
      </button>
      <button className="Home" type="button" onClick={handleHome}>
        <img src={home} alt="Home" className="home-image" />
      </button>
      <div className="errorLoadGame">{information}</div>

      <div className="gamepinLoadGame">
        <label className="loadgameLabel gamepinLoadGameLabel">
          {t("Enter Roomcode")}
        </label>
        <input
          type="text"
          className="inputLoadGame gamepinLoadGameInput"
          value={gamepin}
          placeholder={t("Roomcode")}
          onChange={(event) => setGamepin(event.target.value)}
        />
      </div>

      <div className="buttonRowLoadGame">
        <button type="submit" className="loadgame button" onClick={loadGame}>
          {t("Start")}
        </button>
      </div>

      <div className="languageRow">
        <img
          className="flagImg2"
          id="DEN"
          src={den_flag}
          alt="Danish"
          onClick={() => handleChangeLanguage("dk")}
        />
        <img
          className="flagImg2"
          id="EN"
          src={uk_flag}
          alt="English"
          onClick={() => handleChangeLanguage("en")}
        />
        <img
          className="flagImg2"
          id="NL"
          src={nl_flag}
          alt="Dutch"
          onClick={() => handleChangeLanguage("nl")}
        />
      </div>
    </div>
  );
}
