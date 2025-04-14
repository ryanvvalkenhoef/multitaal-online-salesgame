import React, { useState, useEffect } from "react";
import "./SettingsPanelStyle.css";
import { useNavigate } from "react-router-dom";
import home from "../../Assets/back-button.png";
import { socket } from "../../client";
import { useTranslation } from "react-i18next";
import { useLanguageManager } from "../../Translations/LanguageManager";
import den_flag from "../../Assets/den_flag.png";
import uk_flag from "../../Assets/uk_flag.png";
import nl_flag from "../../Assets/nl_flag.png";
import ModSettings from "../../GameSettings/ModSettings";

export function SettingsPanel() {
  const { t, i18n } = useTranslation("global");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();
  const navigate = useNavigate();

  const handleGame = () => {
    navigate("/Gamepin");
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    ModSettings.createRoom();
    handleGame();
  };

  const [playerCount, setPlayerCount] = useState(ModSettings.getState().playerCount);
  const [roundsCount, setRoundsCount] = useState(ModSettings.getState().roundsCount);

  useEffect(() => {
    const updateHandler = (state) => {
      setPlayerCount(state.playerCount);
      setRoundsCount(state.roundsCount);
    };

    ModSettings.on("update", updateHandler);

    return () => {
      ModSettings.off("update", updateHandler); // Opruimen bij unmount
    };
  }, []);

  const handlePlayerCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 6) {
      ModSettings.setPlayerCount(value);
    }
  };

  const handleRoundsCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 3 && value <= 30) {
      ModSettings.setRoundsCount(value);
    }
  };

    return (
        <div className="parent-container-settings">
          <button className="Qbutton" onClick={handleGuide}>
            ?
          </button>
          <form className="form-container-settings" onSubmit={handleSubmit}>
            <button className="Home" type="button" onClick={handleHome}>
              <img src={home} alt="Home" className="home-image" />
            </button>
    
            <div className="playerRowSettings">
              <div className="settings text">{t("ModSettings.players")}</div>
              <div className="player minus" onClick={() => ModSettings.decrementPlayerCount() }>
                -
              </div>
              <input
                id="playerCount"
                name="playerCount"
                className="player count"
                value={playerCount}
                onChange={handlePlayerCountChange}
              />
              <div className="player plus" onClick={() => ModSettings.incrementPlayerCount()}>
                +
              </div>
            </div>
    
            <div className="roundsRowSettings">
              <div className="settings text">{t("ModSettings.rounds")}</div>
              <div className="rounds minus" onClick={() => ModSettings.decrementRoundsCount()}>
                -
              </div>
              <input
                id="roundsCount"
                name="roundsCount"
                className="rounds count"
                value={roundsCount}
                onChange={handleRoundsCountChange}
              />
              <div className="rounds plus" onClick={() => ModSettings.incrementRoundsCount()}>
                +
              </div>
            </div>
    
            <div className="buttonRowSettings">
              <button type="submit" className="continueButton continueSettings">
                {" "}
                {t("ModSettings.continue")}{" "}
              </button>
            </div>
          </form>
          <div className="languageRow">
            <img
              className="flagImg3"
              id="DEN"
              src={den_flag}
              alt="Danish"
              onClick={() => handleChangeLanguage("dk")}
            />
            <img
              className="flagImg3"
              id="EN"
              src={uk_flag}
              alt="English"
              onClick={() => handleChangeLanguage("en")}
            />
            <img
              className="flagImg3"
              id="NL"
              src={nl_flag}
              alt="Dutch"
              onClick={() => handleChangeLanguage("nl")}
            />
          </div>
        </div>
      );
}