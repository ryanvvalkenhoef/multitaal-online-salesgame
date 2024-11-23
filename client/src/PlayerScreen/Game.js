import React, { useState, useEffect, useRef } from 'react';
import {socket} from '../client'
import './GameStyle.css';
import BoardGrid from "../GameScreen/Board/BoardGrid";
import DiceContainer from '../GameScreen/Dice/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard/LeaderBoard";
import PlayerPopUps from "../GameScreen/PopUps/PlayerPopUps";
import PlayerTurns from "../GameScreen/PlayerTurns";
import AudioPlayer from "../GameScreen/AudioPlayer";
import '../App.css'
import {useTranslation} from "react-i18next";
import RenderManager from "../RenderManager/RenderManager";
import {
    cleanUpSocketListeners,
    handleColorAddition,
    handlePieceAddition,
    handleTileInfo2Update,
    handleTileInfoUpdate
} from "../GameScreen/Board/socketEventListeners";

export function Game() {
    const { t, i18n } = useTranslation('global');
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("")
    const [steps, setSteps] = useState(0)
    const [moveMade, setMoveMade] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState ('')
    const [playerColor, setPlayerColor] = useState(null)//Doesn't work if set to empty string
    const [popupColor, setPopupColor] = useState('')
    const [myTurn, setMyTurn] = useState(true)
    const [selectedPawn , setSelectedPawn] = useState(<div></div>)
    const [position, setPosition] = useState("8-5")
    const [isPopUpEnabled, setIsPopUpEnabled] = useState(false)
    const [isWaitingScreenEnabled, setIsWaitingScreenEnabled] = useState(false)
    const [textBoxContent, setTextBoxContent] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [turnText, setTurnText] = useState(t("Game.wait"))
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')
    const currentQuestionRef = useRef(null);
    const [tileInfo, setTileInfo] = useState([])
    const [tileInfo2, setTileInfo2] = useState([])
    const [joinedColors, setJoinedColors] = useState([])
    const [startPieces, setStartPieces] = useState([])
    const[isReadyToRender, setIsReadyToRender] = useState(false);
    const [isPlayerConnected, setIsPlayerConnected] = useState(false);



    const handleTextBoxChange = (event) => {
        setTextBoxContent(event.target.value);
    };

    const handleSubmitAnswer = () => {
        setIsPopUpEnabled(false);
        setTextBoxContent('');
        //setIsWaitingScreenEnabled(true);
        currentQuestionRef.current.playerAnswer = textBoxContent;
        currentQuestionRef.current.playerId = socket.id;
        socket.emit('send_answer_to_server', currentQuestionRef.current)
        socket.emit('update_hasFinishedTurn',true);
    };


    useEffect(() =>{
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const func  = async () => {
            const renderManager = new RenderManager(setStartPieces, setTileInfo, setTileInfo2, setJoinedColors, setIsReadyToRender, socket)
            handleTileInfoUpdate(socket, setTileInfo, (data) => renderManager.setTileInfo(data));
            handleTileInfo2Update(socket, setTileInfo2, (data) => renderManager.setTileInfo2(data));
            handlePieceAddition(socket, setStartPieces, (data) => renderManager.setPieces(data));
            handleColorAddition(socket, setJoinedColors, (data) => renderManager.setJoinedColors(data));
            socket.on('player_is_connected', () => {
                setIsPlayerConnected(true);
            })

            if (!socket.connected) {
                socket.connect();
                console.log("tesst")
                await delay(1000)
            }


            console.log("in conecttion event")
            if (socket.id === sessionStorage.getItem('socketId')) {
                setIsPlayerConnected(true)
            } else {
                const sessionData = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    sessionData[key] = sessionStorage.getItem(key);
                }
                socket.emit('reconnect_player', sessionData);

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
            'rounds': (data) => {
                setTotalRounds(data.totalRounds)
                setCurrentRound(data.currentRound)
                setRoundText(t("Game.setRoundText", {data}))
            },
            'player_names': (data) => {
                setPlayerName(data)
                setTurnText(t("Game.setTurnText", { data }))
            },
            'update_leaderboard': (jsonData) => {
                console.log("leaderbord update")
                setData(jsonData)
            },
            'receive_question': (data) => {
                currentQuestionRef.current = data;
                setPopupColor(currentQuestionRef.current.questionColor)
                setQuestion(currentQuestionRef.current.questionText);
                setIsPopUpEnabled(true);
            },
            'disable_waiting_screen' : (data) => {
                setIsWaitingScreenEnabled(false)
                //socket.emit('get_data', 'leaderboard_update');
            },
            'players_turn': (strategy) => {
                try {
                    const pawn = document.querySelector('#' + strategy)
                    const parent = pawn.parentElement
                    const parentPosition = parent.getAttribute('data-pos')

                    setPosition(parentPosition)
                    console.log('game', parentPosition)
                    setSelectedPawn(pawn)
                } catch (TypeError) {
                    socket.emit('pawns_request_failed', '')
                }
            },

            'set_turn_true': () => {
                setMyTurn(true);
            },

            'game_over': () => {
                console.log('game over');
                alert("game over");
            }
            
            
        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })

        return () => {
            Object.keys(socketHandlers).forEach(event => {
                socket.off(event, socketHandlers[event])
            })
            cleanUpSocketListeners(socket);
        }
    },[])//,[currentPlayer]

    return (
        <>
            {isReadyToRender ? (
                <div className={isPopUpEnabled || isWaitingScreenEnabled ? 'appBlurred' : 'playboard'}>
                    <div className='roundscounter'>{roundText}</div>
                    <BoardGrid
                        steps={steps}
                        moveMade={moveMade}
                        setMoveMade={setMoveMade}
                        selectedPawn={selectedPawn}
                        setSelectedPawn={setSelectedPawn}
                        setPosition={setPosition}
                        setCurrentPlayer={setCurrentPlayer}
                        currentPlayer={currentPlayer}
                        playerColor={playerColor}
                        setPlayerColor={setPlayerColor}
                        gameScreen={true}
                        tileInfo={tileInfo}
                        tileInfo2={tileInfo2}
                        joinedColors={joinedColors}
                        startPieces={startPieces}
                    />
                    <DiceContainer
                        setSteps={setSteps}
                        setMoveMade={setMoveMade}
                        position={position}
                        myTurn={myTurn}
                        setMyTurn={setMyTurn}
                    />
                    <LeaderBoard sortedUserData={sortedUserData} playerName={playerName} />
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

