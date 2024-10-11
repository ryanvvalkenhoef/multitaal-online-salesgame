import React, { useState, useEffect,useRef } from 'react';
import '../PlayerScreen/GameStyle.css';
import '../App.css';
import {socket} from '../client'
import DiceContainer from '../GameScreen/DiceContainer';
import LeaderBoard from "../GameScreen/LeaderBoard";
import ModeratorPopUps from "../GameScreen/ModeratorPopUps";
import BoardGrid from "../GameScreen/BoardGrid";
import {useTranslation} from "react-i18next";
import { useLanguageManager } from '../Translations/LanguageManager';
import den_flag from '../Assets/den_flag.png';
import uk_flag from '../Assets/uk_flag.png';
import nl_flag from '../Assets/nl_flag.png';

export function ModView() {
    const { t, i18n } = useTranslation('global');
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const sortedUserData = data.sort((a, b) => b.points - a.points);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [moveMade, setMoveMade] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState (0)
    const [color, setColor] = useState('')
    const [userColor, setUserColor] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [selectedPawn , setSelectedPawn] = useState()
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState("8-5")
    const [submittedAnswer, setSubmittedAnswer] = useState(null)
    const [diceValue, setDiceValue] = useState(1);
    const [selectedPoints, setSelectedPoints] = useState(null);
    const [currentRound, setCurrentRound] = useState(0)
    const [totalRounds, setTotalRounds] = useState(0)
    const [roundText, setRoundText] = useState('')
    const { handleChangeLanguage, handleGuide } = useLanguageManager();
    const questionQueRef = useRef([]);
    const isFirstRender = useRef(true);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const submittedAnswersQueueRef = useRef([]);
    const submittedAnswerRef = useRef(null);

    const handleUpdatePoints = (points) => {
        setSelectedPoints(points);
    };

    const handleSubmitPoints = () => {
       
        
        if (submittedAnswerRef.current !== t("Game.modWait")) {
            setShowPopup(false)
            socket.emit("submit_points", { points: selectedPoints, color: userColor, playerId: currentQuestion.playerId});
            //setSubmittedAnswer(t("Game.modWait"));
            submittedAnswerRef.current= t("Game.modWait");
            setSelectedPoints([]);
            
            submittedAnswersQueueRef.current.shift();
            if(submittedAnswersQueueRef.current.length > 0){
                submittedAnswerRef.current = submittedAnswersQueueRef.current[0];
                //setSubmittedAnswersQueue(newSubmittedAnswersQue);
                
            }

            //const newQuestionQue = questionQue.splice();
            //newQuestionQue.shift();
            questionQueRef.current.shift();
            if(questionQueRef.current.length > 0){
                setCurrentQuestion(questionQueRef.current[0]);
               // setQuestionQue(newQuestionQue)
            }

        }
    };

    useEffect(()=>{
        
        
        if(isFirstRender.current){
            
            isFirstRender.current = false
            return;
        }
        
        
        else{
            if(showPopup === false){
                
                
            setShowPopup(true);
            setQuestion(currentQuestion.questionText);
            setColor(currentQuestion.color);
            setUserColor(currentQuestion.userColor);
            setAnswer(currentQuestion.answer);

            }
        }
    

    }, [currentQuestion])
    

    useEffect(() => {
        
        const socketHandlers = {
            'set_dice': (data) => {
                setDiceValue(data);
            },
            'rounds': (data) => {
                setTotalRounds(data.totalRounds)
                setCurrentRound(data.currentRound)
                setRoundText(t("Game.setRoundText", {data}))
            },
            'players_name': (data) => {
                setPlayerName(data)
            },
            'data_leaderboard': (jsonData) => {
                
                
                  
                setData(jsonData)
                //socket.emit('get_current','mod')
            },
            'set_current_player': (data)=> {
                try {
                
                    
                    const pawn = document.querySelector('#' + data)
                    setSelectedPawn(pawn)
                } catch (TypeError) {
                    socket.emit('pawns_request_failed', '')
                }
            },
            'receive_player_answer_through_pop_up': (QuestionInformation)=> {
                       
                questionQueRef.current.push(QuestionInformation);
            
                if(currentQuestion === null){
                    setCurrentQuestion(questionQueRef.current[0])
                }

            },

            'receive_answer': (data)=> {
                setAnswer(data);
            },
            'submitted_answer': (data)=> {
                // let newSubmittedAnswersQueue = [...submittedAnswersQueue];
                // newSubmittedAnswersQueue.push(data.text);
                // setSubmittedAnswersQueue(newSubmittedAnswersQueue);
                submittedAnswersQueueRef.current.push(data.text);

                if(submittedAnswerRef.current === null){
                    
                    
                    submittedAnswerRef.current = submittedAnswersQueueRef.current[0];
                }

              
                

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
            <div className={showPopup ? 'appBlurred' : 'playboard'}>
                <button className="Qbutton2" onClick={handleGuide}>?</button>
                <div className='roundscounter'>{roundText}</div>
                <BoardGrid
                    moveMade={moveMade}
                    setMoveMade={setMoveMade}
                    setPosition={setPosition}
                    selectedPawn={selectedPawn}
                    setSelectedPawn={setSelectedPawn}
                    modView={true}/>
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
            </div>
                <ModeratorPopUps
                    answer={answer}
                    color={color}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    question={question}
                    submittedAnswer={currentQuestion && currentQuestion.answer}// When the game starts currentQuestion will be null
                    selectedPoints={selectedPoints}
                    handleSubmitPoints={handleSubmitPoints}
                    handleUpdatePoints={handleUpdatePoints}
                />
        </>
    );
}