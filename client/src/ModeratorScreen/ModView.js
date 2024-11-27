import React, { useState, useEffect,useRef } from 'react';
import '../PlayerScreen/GameStyle.css';
import '../App.css';
import {socket} from '../client'
import DiceContainer from '../GameScreen/Dice/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard/LeaderBoard";
import ModeratorPopUps from "../GameScreen/PopUps/ModeratorPopUps";
import BoardGrid from "../GameScreen/Board/BoardGrid";
import {useTranslation} from "react-i18next";
import { useLanguageManager } from '../Translations/LanguageManager';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';
import RenderManager from "../RenderManager/RenderManager";
import {
    handleColorAddition,
    handlePieceAddition,
    handleTileInfo2Update,
    handleTileInfoUpdate
} from "../GameScreen/Board/socketEventListeners";

export function ModView() {
    const { t, i18n } = useTranslation('global');
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [moveMade, setMoveMade] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [popupColor, setColor] = useState('')
    const [userColor, setUserColor] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [selectedPawn , setSelectedPawn] = useState()
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState("8-5")
    const [diceValue, setDiceValue] = useState(1);
    const [selectedPoints, setSelectedPoints] = useState(null);
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')
    const { handleChangeLanguage, handleGuide } = useLanguageManager();
    const playerCountRef = useRef(0);
    const currentQuestionRef = useRef(null);
    const [tileInfo, setTileInfo] = useState([])
    const [tileInfo2, setTileInfo2] = useState([])
    const [joinedColors, setJoinedColors] = useState([])
    const [startPieces, setStartPieces] = useState([])
    const[isReadyToRender, setIsReadyToRender] = useState(false);

   

    const handleUpdatePoints = (points) => {
        setSelectedPoints(points);
    };

    const reviewQuestion = (questionData) =>{
        setShowPopup(true);
        setQuestion(questionData.questionText);
        setColor(questionData.questionColor);
        setUserColor(questionData.playerColor);
        setAnswer(questionData.answer);
        currentQuestionRef.current = questionData;
}

    const submitPoints = () =>{
            setShowPopup(false)
            socket.emit("submit_points", { points: selectedPoints, color: userColor, playerId: currentQuestionRef.current.playerId}, );
            socket.emit('question_reviewed');
            setSelectedPoints([]);
    }

    const handleSubmitPoints = () => {
            submitPoints()
    };



    useEffect(() => {


        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const func  = async () => {
            const renderManager = new RenderManager(setStartPieces, setTileInfo, setTileInfo2, setJoinedColors, setIsReadyToRender, socket)
            handleTileInfoUpdate(socket, setTileInfo, (data) => renderManager.setTileInfo(data));
            handleTileInfo2Update(socket, setTileInfo2, (data) => renderManager.setTileInfo2(data));
            handlePieceAddition(socket, setStartPieces, (data) => renderManager.setPieces(data));
            handleColorAddition(socket, setJoinedColors, (data) => renderManager.setJoinedColors(data));
            socket.on('player_is_connected', () => {
                //setIsPlayerConnected(true);
            })

            if (!socket.connected) {
                socket.connect();
                console.log("tesst")
                await delay(1000)
            }


            console.log("in conecttion event")
            if (socket.id === sessionStorage.getItem('socketId')) {
                //setIsPlayerConnected(true)
            } else {
                const sessionData = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    sessionData[key] = sessionStorage.getItem(key);
                }
                socket.emit('reconnect_mod', sessionData);

                console.log("socket id ==== ", socket.id);
                sessionStorage.setItem('socketId', socket.id);
                console.log("sessionStorage: ", sessionStorage.getItem('socketId'))
            }





            socket.emit('get_tileInfo');
            socket.emit('get_pieces');
            console.log("getting_pieces");
            socket.emit('send_player_colors');
        }


        func().then(r => {})

        const socketHandlers = {
            'set_dice': (data) => {
                setDiceValue(data);
            },
            'rounds': (data) => {
                setTotalRounds(data.totalRounds)
                setCurrentRound(data.currentRound)
                setRoundText(t("Game.setRoundText", {data}))
            },
            'player_names': (data) => {
                setPlayerName(data)
            },
            'update_leaderboard': (jsonData) => {
                setData(jsonData)
            },
            'set_current_player': (data)=> {
                try {
                    const pawn = document.querySelector('#' + data)
                    setSelectedPawn(pawn)
                } catch (TypeError) {
                    socket.emit('pawns_request_failed', '')
                }
            },
            'receive_player_answer': (questionData)=> { //parameter is an object
                    reviewQuestion(questionData)
            },

            'player_count': (playerCount) => {
                playerCountRef.current = playerCount;
            },

            'game_over': () => {
                alert("game over");
            }

        }

        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })

        return () => {
            Object.keys(socketHandlers).forEach(event =>{
                socket.off(event, socketHandlers[event])
            })
        };
    }, []);


    return (
        <>
            {isReadyToRender? <div className={showPopup ? 'appBlurred' : 'playboard'}>
                <button className="Qbutton2" onClick={handleGuide}>?</button>
                <div className='roundscounter'>{roundText}</div>
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
                    startPieces={startPieces}/>
                <DiceContainer
                    setMoveMade={setMoveMade}
                    position={position}
                    diceValue={diceValue}
                    isModeratorScreen={true}/>
                <LeaderBoard
                    sortedUserData={sortedUserData}
                    playerName={playerName}/>
                {/*flags use audio.css*/}
                <div><img className='flagImg6' id='DEN' src={den_flag} alt='Danish' onClick={() => handleChangeLanguage('dk')} /></div>
                <div><img className='flagImg7' id='EN' src={uk_flag} alt='English' onClick={() => handleChangeLanguage('en')} /></div>
                <div><img className='flagImg8' id='NL' src={nl_flag} alt='Dutch' onClick={() => handleChangeLanguage('nl')} /></div>
            </div> : (
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
                    submittedAnswer={currentQuestionRef.current && currentQuestionRef.current.playerAnswer}// When the game starts currentQuestion will be null
                    selectedPoints={selectedPoints}
                    handleSubmitPoints={handleSubmitPoints}
                    handleUpdatePoints={handleUpdatePoints}
                />
        </>
    );
}