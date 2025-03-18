import React, { useState } from "react";
import "./SettingsPanelStyle.css";
import home from "../Assets/back-button.png";
import { socket } from "../client";
import { useTranslation } from "react-i18next";
import { useLanguageManager } from "../Translations/LanguageManager";
import den_flag from "../Assets/den_flag.png";
import uk_flag from "../Assets/uk_flag.png";
import nl_flag from "../Assets/nl_flag.png";
import {
    handleHome,
    handlePlayerCountChange,
    handleRoundsCountChange,
    decrementPlayerCount,
    incrementPlayerCount,
    decrementRoundsCount,
    incrementRoundsCount,
    handleSubmit
} from "../../GameSettings/ModSettings";
import ModSettings from "../../GameSettings/ModSettings";

const SettingsPanel = () => {
  const { t, i18n } = useTranslation("global");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();
  const [playerCount, setPlayerCount] = useState(2);
  const [roundsCount, setRoundsCount] = useState(3);

  const modSettings = new ModSettings(setPlayerCount, setRoundsCount);

  const handlePlayerCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 6) {
      setPlayerCount(value);
    }
  };

  const handleRoundsCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 3 && value <= 30) {
      setRoundsCount(value);
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
              <div className="player minus" onClick={() => modSettings.decrementPlayerCount(playerCount)}>
                -
              </div>
              <input
                id="playerCount"
                name="playerCount"
                className="player count"
                value={playerCount}
                onChange={handlePlayerCountChange}
              />
              <div className="player plus" onClick={() => modSettings.incrementPlayerCount(playerCount)}>
                +
              </div>
            </div>
    
            <div className="roundsRowSettings">
              <div className="settings text">{t("ModSettings.rounds")}</div>
              <div className="rounds minus" onClick={() => modSettings.decrementRoundsCount(roundsCount)}>
                -
              </div>
              <input
                id="roundsCount"
                name="roundsCount"
                className="rounds count"
                value={roundsCount}
                onChange={handleRoundsCountChange}
              />
              <div className="rounds plus" onClick={() => modSettings.incrementRoundsCount(roundsCount)}>
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

export default SettingsPanel;