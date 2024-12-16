import React, { useEffect, useState } from 'react';
import '../PlayerScreen/GameStyle.css';
import './ResultScreen.css';
import '../App.css';
import { socket } from '../client';
import { useNavigate } from "react-router-dom";
import { useLanguageManager } from "../Translations/LanguageManager";
import den_flag from "../Assets/den_flag.png";
import uk_flag from "../Assets/uk_flag.png";
import nl_flag from "../Assets/nl_flag.png";
import { useTranslation } from "react-i18next";

export function Results() {
    const navigate = useNavigate();
    const {t} = useTranslation('global');
    const {language, handleChangeLanguage, handleGuide} = useLanguageManager();
    const [users, showUsers] = useState([]);
    const [showResultArray, setShowResultArray] = useState([]);
    let scoreArray = [];
    const handleReturn = () => {
        navigate('/home');
    }

    const handleExit = () => {
        window.open('', '_self', '').close();
    }
    const clearSessionStorage = () => { // The game is finished so the session data stored in the browser can be removed
        sessionStorage.removeItem('socketId');
        sessionStorage.removeItem('room');
    }

    useEffect (() => {

        if(sessionStorage.getItem('socketId')) {
            socket.emit('get_results');
            clearSessionStorage();
        }

        const socketHandlers = {
            'show_results' : (results) => {
              setShowResultArray(results);
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
    },[]);



    return (
        <>
        <div className="parent-container-results">
            <button className="Qbutton" onClick={handleGuide}>?</button>
            <h1>{t("Results.resultHeader")}</h1>
                <div className="Results">
                    {showResultArray.sort((a,b) => {
                      if (a.score > b.score) return -1
                     if (a.score < b.score) return 1
                     return 0
                     }).map((results, index) => (
                        <div className="Placement" key={index}>
                            {index + 1}. {results.name}: {results.totalPoints} {t("Results.points")}
                        </div>))}
                </div>
            <button className='home' type="button" onClick={handleReturn}>
                    {t("Results.menuButton")}
                </button>

            <div className="languageRow">
                <img className='flagImg2' id='DEN' src={den_flag} alt='Danish'
                     onClick={() => handleChangeLanguage('dk')}/>
                <img className='flagImg2' id='EN' src={uk_flag} alt='English'
                     onClick={() => handleChangeLanguage('en')}/>
                <img className='flagImg2' id='NL' src={nl_flag} alt='Dutch'
                     onClick={() => handleChangeLanguage('nl')}/>
            </div>
        </div>
            </>
    );
}