import React, { useState, useEffect } from "react";
import "./PlayerProgressStyle.css";
import { socket } from "../../client";
import { useTranslation } from "react-i18next";

const PlayerProgress = ({ playerProgressData, onImageClick }) => {
  const [playersAnsweringQuestion, setPlayersAnsweringQuestion] = useState([]);
  const [playersFinishedTurn, setPlayersFinishedTurn] = useState([]);
  const [playersReviewed, setPlayersReviewed] = useState([]);
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    const playerState = new PlayerState(
      setPlayersAnsweringQuestion,
      setPlayersFinishedTurn,
      setPlayersReviewed,
      socket
    );

    playerState.initSocketListeners();

    return () => {
      socket.off("player_is_answering");
      socket.off("player_has_finished_turn");
      socket.off("player_has_been_reviewed");
      socket.off("reset_player_progress_styles");
    };
  }, []);

  return (
    <div className="player-progress-container">
      <label className="progress-label">{t("Game.playerProgress")} </label>
      {playerProgressData.map((data) => (
        <button
          key={data.id}
          className="image-button"
          onClick={() => {
            if (playersFinishedTurn.includes(data.id)) {
              onImageClick(data.id);
            }
          }}
        >
          <img
            className={`image ${
              playersAnsweringQuestion.includes(data.id)
                ? "answering"
                : playersFinishedTurn.includes(data.id)
                  ? "finished"
                  : playersReviewed.includes(data.id)
                    ? "reviewed"
                    : ""
            } ${
              data.strategy === "Safeline"
                ? "piecesafeline"
                : data.strategy === "Lunar"
                  ? "piecelunar"
                  : data.strategy === "Domino House"
                    ? "piecedomino"
                    : data.strategy === "Klaphatten"
                      ? "pieceklaphatten"
                      : data.strategy === "Top of the World"
                        ? "pieceworld"
                        : data.strategy === "Jysk Telepartner"
                          ? "piecejysk"
                          : ""
            }`}
            alt=""
          />
        </button>
      ))}
    </div>
  );
};
export default PlayerProgress;
