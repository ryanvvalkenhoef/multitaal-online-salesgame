import React, { useState, useEffect, useRef } from "react";
import { socket } from "../client";
import "./GameStyle.css";
import BoardGrid from "./UI/BoardGrid";
import DiceContainer from "../components/UI/DiceContainer";
import LeaderBoard from "../components/UI/LeaderBoard";
import PlayerPopUps from "../components/UI/PlayerPopUps";
import PlayerTurns from "../components/UI/PlayerTurns";
import AudioPlayer from "../components/UI/AudioPlayer";
import Pieces from "../components/UI/Pieces";
import "../App.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RenderManager from "../RenderManager/RenderManager";
import {
  cleanUpSocketListeners,
  handleColorAddition,
  handlePieceAddition,
  handleTileInfo2Update,
  handleTileInfoUpdate,
  handleCurrentPlayerRegistration,
  handleUpdateRound,
  handleNameUpdate,
  handleLeaderBoardUpdate,
  handleReceivingQuestion,
  handleDisablingWaitingScreen,
  handlePlayerTurnUpdate,
  handleTurnStatusUpdate,
  handleGameOverEvent,
  handleSetRollDice,
  handleGoToHomeScreen,
  handlePositionsUpdate,
  handleSetPosition,
} from "../modules/playerModule/PlayerEvents";
import { startRender } from "../screenRenderer";

export function Game() {
  const { t, i18n } = useTranslation("global");
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const sortedUserData = data.sort((a, b) => b.totalPoints - a.totalPoints);
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState(0);
  const [moveMade, setMoveMade] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playerColor, setPlayerColor] = useState(null); //Doesn't work if set to empty string
  const [playerRollDice, setPlayerRollDice] = useState(false);
  const [popupColor, setPopupColor] = useState("");
  const [myTurn, setMyTurn] = useState(false);
  const [position, setPosition] = useState("8-5");
  const [selectedPawn, setSelectedPawn] = useState(document.createElement('div'));
  const [isPopUpEnabled, setIsPopUpEnabled] = useState(false);
  const [isWaitingScreenEnabled, setIsWaitingScreenEnabled] = useState(false);
  const [textBoxContent, setTextBoxContent] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [turnText, setTurnText] = useState(t("Game.wait"));
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [roundText, setRoundText] = useState("");
  const [tileInfo, setTileInfo] = useState([]);
  const [tileInfo2, setTileInfo2] = useState([]);
  const [joinedColors, setJoinedColors] = useState([]);
  const [startPieces, setStartPieces] = useState([]);
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const [piecePositions, setPiecePositions] = useState([]);
  const [arePiecesRendered, setArePiecesRendered] = useState(false);
  const [isBoardRendered, setIsBoardRendered] = useState(false);
  const navigate = useNavigate();
  const currentQuestionRef = useRef(null);

  const handleTextBoxChange = (event) => {
    setTextBoxContent(event.target.value);
  };

  const handleSubmitAnswer = () => {
    setIsPopUpEnabled(false);
    setTextBoxContent("");
    //setIsWaitingScreenEnabled(true);
    currentQuestionRef.current.playerAnswer = textBoxContent;
    currentQuestionRef.current.playerId = socket.id;
    socket.emit("send_answer_to_server", currentQuestionRef.current);
    socket.emit("update_hasFinishedTurn", true);
  };

  useEffect(() => {
    // Adding socketio event listeners
    console.log("rollDice: " + playerRollDice);
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
    handleColorAddition({ socket, setJoinedColors }, (data) =>
      renderManager.setJoinedColors(data),
    );
    handleCurrentPlayerRegistration({
      socket,
      setCurrentPlayer,
      setPlayerColor,
    });
    handleUpdateRound({ socket, setRoundText, t });
    handleNameUpdate({ socket, setPlayerName });
    handleLeaderBoardUpdate({ socket, setData });
    handleReceivingQuestion({
      socket,
      currentQuestionRef,
      setPopupColor,
      setQuestion,
      setIsPopUpEnabled,
    });
    handleDisablingWaitingScreen({ socket, setIsWaitingScreenEnabled });
    handlePlayerTurnUpdate({ socket, setPosition, setSelectedPawn });
    handlePositionsUpdate({ socket, setPiecePositions });
    handleSetPosition({ socket, setPosition });
    handleTurnStatusUpdate({ socket, setMyTurn });
    handleSetRollDice({ socket, setPlayerRollDice });
    handleGoToHomeScreen({ socket, navigate });
    handleGameOverEvent({ socket, navigate });

    return () => {
      cleanUpSocketListeners(socket);
    };
  }, []);

  useEffect(() => {
    // If there is no sessionData stored the game screen can't be rendered
    // So client goes back to the homepage
    if (!sessionStorage.getItem("socketId")) {
      navigate("/home");
    } else {
      //The timeout is used because it takes some time before socketio has created the socket object
      const currentSocketId = socket.id;
      setTimeout(() => startRender(socket, currentSocketId, true), 500);
    }
    setTimeout(() => console.log("rollDice: " + playerRollDice), 1000);
  }, []);

  return (
    <>
      {isReadyToRender ? (
        <div
          className={
            isPopUpEnabled || isWaitingScreenEnabled
              ? "appBlurred"
              : "playboard"
          }
        >
          <div className="roundscounter">{roundText}</div>
          {arePiecesRendered && (
            <BoardGrid
              selectedPawn={selectedPawn}
              setPosition={setPosition}
              playerColor={playerColor}
              gameScreen={true}
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
          <DiceContainer
            setMoveMade={setMoveMade}
            position={position}
            myTurn={myTurn}
            setMyTurn={setMyTurn}
            playerRollDice={playerRollDice}
            setPlayerRollDice={setPlayerRollDice}
          />
          <LeaderBoard
            sortedUserData={sortedUserData}
            playerName={playerName}
          />
          <PlayerTurns turnText={turnText} />
        </div>
      ) : (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      )}
      <AudioPlayer />
      <PlayerPopUps
        setPopupColor={setPopupColor}
        popupColor={popupColor}
        isPopUpEnabled={isPopUpEnabled}
        isWaitingScreenEnabled={isWaitingScreenEnabled}
        question={question}
        textBoxContent={textBoxContent}
        handleTextBoxChange={handleTextBoxChange}
        handleSubmitAnswer={handleSubmitAnswer}
      />
    </>
  );
}
