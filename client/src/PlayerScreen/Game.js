import React, { useState, useEffect, useRef } from 'react';
import {socket} from '../client'
import './GameStyle.css';
import BoardGrid from "../GameScreen/BoardGrid";
import DiceContainer from '../GameScreen/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard";
import PlayerPopUps from "../GameScreen/PlayerPopUps";
import PlayerTurns from "../GameScreen/PlayerTurns";
import AudioPlayer from "../GameScreen/AudioPlayer";
import '../App.css'
import {useTranslation} from "react-i18next";

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
    const [gamePaused, setGamePaused] = useState(false)
    const [gamePaused2, setGamePaused2] = useState(false)
    const [textBoxContent, setTextBoxContent] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [turnText, setTurnText] = useState(t("Game.wait"))
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')
    const currentQuestion = useRef(null);
    

    const handleTextBoxChange = (event) => {
        setTextBoxContent(event.target.value);
    };

    const handleSubmitAnswer = () => {
        setGamePaused(false);
        setTextBoxContent('');
        setGamePaused2(true);
        currentQuestion.current.playerAnswer = textBoxContent;
        currentQuestion.current.playerId = socket.id;
        socket.emit('send_answer_to_server', currentQuestion.current)
        socket.emit('updateHasFinishedTurn',true);
    };

    useEffect(() =>{
        
        
        const socketHandlers = {
            'rounds': (data) => {
                setTotalRounds(data.totalRounds)
                setCurrentRound(data.currentRound)
                setRoundText(t("Game.setRoundText", {data}))
            },
            'players_name': (data) => {
                setPlayerName(data)
                
                
                setTurnText(t("Game.setTurnText", { data }))
            },
            'data_leaderboard': (jsonData) => {
                setData(jsonData)
            },
            'receive_question': (data) => {
                currentQuestion.current = data;
                setPopupColor(currentQuestion.current.questionColor)
                setQuestion(currentQuestion.current.questionText);
                setGamePaused(true);
            },
            'submitted_points' : (data) => {
                console.log('sumbitted points')
                setGamePaused2(false)
                //socket.emit('get_data', 'leaderboard_update');
            },
            'players_turn': (strategy) => {
                try {
                    const pawn = document.querySelector('#' + strategy)
                    const parent = pawn.parentElement
                    const parentPosition = parent.getAttribute('pos')
                    
                    setPosition(parentPosition)
                    
                    console.log('game', parentPosition)
                    setSelectedPawn(pawn)
                    
                   
                } catch (TypeError) {
                    
                    socket.emit('pawns_request_failed', '')
                }
            },

            'game_over': () => {
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
        }
    },[])//,[currentPlayer]

    return (
    <>
        <div className={gamePaused || gamePaused2 ? 'appBlurred' : 'playboard'}>
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
                
                />
            <DiceContainer
                setSteps={setSteps}
                setMoveMade={setMoveMade}
                position={position}
                myTurn={myTurn}
                setMyTurn={setMyTurn}/>
            <LeaderBoard
                sortedUserData={sortedUserData}
                playerName={playerName}/>
            <PlayerTurns
                turnText={turnText}/>
        </div>
        <AudioPlayer
            />
            <PlayerPopUps
                setPopupColor={setPopupColor}
                popupColor={popupColor}
                gamePaused={gamePaused}
                gamePaused2={gamePaused2}
                question={question}
                textBoxContent={textBoxContent}
                handleTextBoxChange={handleTextBoxChange}
                handleSubmitAnswer={handleSubmitAnswer}
            />
        </>
    )
}

