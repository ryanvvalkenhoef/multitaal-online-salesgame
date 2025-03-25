import React, { useState } from "react";
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
    modSettings.createRoom();
    handleGame();
  };

  const modSettings = new ModSettings();

  const handlePlayerCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 6) {
      modSettings.setPlayerCount(value);
    }
  };

  const handleRoundsCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 3 && value <= 30) {
      modSettings.setRoundsCount(value);
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
              <div className="player minus" onClick={() => modSettings.decrementPlayerCount(modSettings.playerCount)}>
                -
              </div>
              <input
                id="playerCount"
                name="playerCount"
                className="player count"
                value={modSettings.state.playerCount}
                onChange={handlePlayerCountChange}
              />
              <div className="player plus" onClick={() => modSettings.incrementPlayerCount(modSettings.playerCount)}>
                +
              </div>
            </div>
    
            <div className="roundsRowSettings">
              <div className="settings text">{t("ModSettings.rounds")}</div>
              <div className="rounds minus" onClick={() => modSettings.decrementRoundsCount(modSettings.roundsCount)}>
                -
              </div>
              <input
                id="roundsCount"
                name="roundsCount"
                className="rounds count"
                value={modSettings.state.roundsCount}
                onChange={handleRoundsCountChange}
              />
              <div className="rounds plus" onClick={() => modSettings.incrementRoundsCount(modSettings.roundsCount)}>
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