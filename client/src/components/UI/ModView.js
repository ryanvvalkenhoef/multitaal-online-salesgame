import React, { useState, useEffect, useRef, useContext } from "react";
import "../GameStyle.css";
import "../../App.css";
import { socket } from "../../client";
import DiceContainer from "./DiceContainer";
import LeaderBoard from "./LeaderBoard";
import ModeratorPopUps from "./ModPopUps";
import BoardGrid from "./BoardGrid";
import { useTranslation } from "react-i18next";
import { useLanguageManager } from "../../Translations/LanguageManager";
import den_flag from "../../Assets/den_flag.png";
import uk_flag from "../../Assets/uk_flag.png";
import nl_flag from "../../Assets/nl_flag.png";
import { useNavigate } from "react-router-dom";
import {
  cleanUpSocketListeners,
  handleColorAddition,
  handlePieceAddition,
  handleTileInfo2Update,
  handleTileInfoUpdate,
  handleUpdateRound,
  handleGameOverEvent,
  handleReceivePlayerAnswer,
  handleLeaderBoardUpdate,
  handleGoToHomeScreen,
  handlePositionsUpdate,
  handleRoundFinished,
} from "../../modules/modModule/ModEvents";
import PlayerProgress from "./PlayerProgress";
import RenderManager from "../../RenderManager/RenderManager";
import BoardEvents from "../../modules/boardModule/BoardEvents";
import { startRender } from "../../screenRenderer";
import Pieces from "./Pieces";
import { ModViewWrapper, ModViewContext } from "../../GameSettings/ModViewWrapper";

export function ModView() {

  const {
    reviewQuestion,
    showPopup,
    setShowPopup,
    answer,
    popupColor,
    color,
    question,
    modViewHandler,
    selectedPoints,
    handleSubmitPoints,
    handleUpdatePoints,
    onImageClick
  } = useContext(ModViewContext);

  const { t, i18n } = useTranslation("global");
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const sortedUserData = [...data].sort(
    (a, b) => b.totalPoints - a.totalPoints,
  );
  const [moveMade, setMoveMade] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [selectedPawn, setSelectedPawn] = useState();
  const [position, setPosition] = useState("8-5");
  const [diceValue, setDiceValue] = useState(1);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [roundText, setRoundText] = useState("");
  const { handleChangeLanguage, handleGuide } = useLanguageManager();
  const navigate = useNavigate();

  const [tileInfo, setTileInfo] = useState([]);
  const [tileInfo2, setTileInfo2] = useState([]);
  const [joinedColors, setJoinedColors] = useState([]);
  const [startPieces, setStartPieces] = useState([]);
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const [piecePositions, setPiecePositions] = useState([]);
  const [arePiecesRendered, setArePiecesRendered] = useState(false);
  const [isBoardRendered, setIsBoardRendered] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    // Adding socketio event listeners
    const renderManager = new RenderManager(
      setStartPieces,
      setTileInfo,
      setTileInfo2,
      setJoinedColors,
      setIsReadyToRender,
      socket,
    );
    handleTileInfoUpdate({ socket, setTileInfo }, (data) =>
      renderManager.setTileInfo(data),
    );
    handleTileInfo2Update({ socket, setTileInfo2 }, (data) =>
      renderManager.setTileInfo2(data),
    );
    handlePieceAddition({ socket, setStartPieces }, (data) =>
      renderManager.setPieces(data),
    );
    handlePositionsUpdate({ socket, setPiecePositions });
    handleColorAddition({ socket, setJoinedColors }, (data) =>
      renderManager.setJoinedColors(data),
    );
    handleLeaderBoardUpdate({ socket, setData });
    handleUpdateRound({ socket, setRoundText, t });
    handleReceivePlayerAnswer({ socket, reviewQuestion });
    handleGoToHomeScreen({ socket, navigate });
    handleGameOverEvent({ socket, navigate });
    handleRoundFinished({ socket, setIsDisabled });

    return () => {
      cleanUpSocketListeners(socket);
    };
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("socketId")) {
      //If there is no sessionData stored the game screen can't be rendered
      navigate("/home");
    } else {
      //The timeout is used because it takes some time before socketio has created the socket object
      const currentSocketId = socket.id;
      setTimeout(() => startRender(socket, currentSocketId, false), 500);
    }
  }, []);

  useEffect(() => {
    if (currentRound >= totalRounds && totalRounds > 0) {
      socket.emit("end_game");
    }
  }, [currentRound, totalRounds]);
  return (
    <>
      {isReadyToRender ? (
        <div className={showPopup ? "appBlurred" : "playboard"}>
          <button className="Qbutton2" onClick={handleGuide}>
            ?
          </button>
          <div className="roundscounter">{roundText}</div>
          {arePiecesRendered && (
            <BoardGrid
              moveMade={moveMade}
              setMoveMade={setMoveMade}
              setPosition={setPosition}
              selectedPawn={selectedPawn}
              setSelectedPawn={setSelectedPawn}
              modView={true}
              tileInfo={tileInfo}
              tileInfo2={tileInfo2}
              joinedColors={joinedColors}
              startPieces={startPieces}
              piecePositions={piecePositions}
              setIsBoardRendered={setIsBoardRendered}
            />
          )}
          <Pieces
            startPieces={startPieces}
            setArePiecesRendered={setArePiecesRendered}
          />
          <PlayerProgress
            playerProgressData={data}
            onImageClick={onImageClick}
          />
          {/*<DiceContainer*/}
          {/*    setMoveMade={setMoveMade}*/}
          {/*    position={position}*/}
          {/*    diceValue={diceValue}*/}
          {/*    isModeratorScreen={true}/>*/}

          <div className="next-round-container">
            <button
              className="next-round-button"
              disabled={isDisabled}
              onClick={() => {
                socket.emit("start_next_round");
              }}
            >
              Next Round
            </button>
          </div>

          <LeaderBoard
            sortedUserData={sortedUserData}
            playerName={playerName}
          />
          {/*flags use audio.css*/}
          <div>
            <img
              className="flagImg6"
              id="DEN"
              src={den_flag}
              alt="Danish"
              onClick={() => handleChangeLanguage("dk")}
            />
          </div>
          <div>
            <img
              className="flagImg7"
              id="EN"
              src={uk_flag}
              alt="English"
              onClick={() => handleChangeLanguage("en")}
            />
          </div>
          <div>
            <img
              className="flagImg8"
              id="NL"
              src={nl_flag}
              alt="Dutch"
              onClick={() => handleChangeLanguage("nl")}
            />
          </div>
        </div>
      ) : (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      )}
      <ModeratorPopUps
        answer={answer}
        popupColor={popupColor}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        question={question}
        submittedAnswer={
          modViewHandler.getCurrentQuestion() && modViewHandler.getCurrentQuestion().playerAnswer
        } // When the game starts currentQuestion will be null
        selectedPoints={selectedPoints}
        handleSubmitPoints={handleSubmitPoints}
        handleUpdatePoints={handleUpdatePoints}
      />
    </>
  );
}