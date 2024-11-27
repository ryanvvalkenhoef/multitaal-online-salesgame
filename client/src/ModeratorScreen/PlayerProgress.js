import React, { useState, useEffect } from 'react';
import Lunar from '../Assets/LUNAR.png';
import TopOfTheWorld from '../Assets/TopOfTheWorld.png';
import Safeline from '../Assets/SAFELINE.png';
import JyskTelepartner from '../Assets/JYSKTelepartner.png';
import DominoHouse from '../Assets/DominoHouse.png';
import Klaphatten from '../Assets/Klaphatten.png';
import './PlayerProgressStyles.css'
import {socket} from "../client";

const PlayerProgress = ({playerProgressData, onImageClick}) => {
    const [playersAnsweringQuestion, setPlayersAnsweringQuestion] = useState([]);
    const [playersFinishedTurn, setPlayersFinishedTurn] = useState([]);
    const [playersReviewed, setPlayersReviewed] = useState([]);
    const strategyImages = {
        'Safeline': Safeline,
        'Lunar': Lunar,
        'Domino House': DominoHouse,
        'Klaphatten': Klaphatten,
        'Top of the World': TopOfTheWorld,
        'Jysk Telepartner': JyskTelepartner
    };

    useEffect(() => {
        socket.on('player_is_answering', (data) => {
            setPlayersAnsweringQuestion((playerIdState) => {
                if (data.isAnsweringQuestion) {
                    // Add the player to the list if not already present
                    return playerIdState.includes(data.playerId) ? playerIdState : [...playerIdState, data.playerId];
                } else {
                    // Remove the player from the list if they stop answering
                    return playerIdState.filter((id) => id !== data.playerId);
                }
            });
        });
        socket.on('player_has_finished_turn', (data) => {
            setPlayersFinishedTurn((playerIdState) => {
                if (data.hasFinishedTurn) {
                    setPlayersAnsweringQuestion((prev) => prev.filter((id) => id !== data.playerId));
                    return playerIdState.includes(data.playerId) ? playerIdState : [...playerIdState, data.playerId];
                } else {
                    return playerIdState.filter((id) => id !== data.playerId);
                }
            });
        });
        socket.on('player_has_been_reviewed', (data) => {
            setPlayersReviewed((playerIdState) => {
                if (data.hasBeenReviewed) {
                    setPlayersFinishedTurn((prev) => prev.filter((id) => id !== data.playerId));
                    return playerIdState.includes(data.playerId) ? playerIdState : [...playerIdState, data.playerId];
                } else {
                    return playerIdState.filter((id) => id !== data.playerId);
                }
            });
        });
        socket.on('reset_player_progress_styles', (data) => {
            setPlayersAnsweringQuestion([]);
            setPlayersFinishedTurn([]);
            setPlayersReviewed([]);
        });

        return () => {
            socket.off('player_answering_question');
            socket.off('player_has_finished_turn');
            socket.off('player_has_been_reviewed');
            socket.off('reset_player_progress_styles');
        };
    }, []);

    return (
        <div className="player-progress-container">
            <label className="progress-label"> Player Progression: </label>
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
                        src={strategyImages[data.strategy]}
                        className={`image ${
                            playersReviewed.includes(data.id) ? 'reviewed' :
                                playersFinishedTurn.includes(data.id) ? 'finished' : 
                                    playersAnsweringQuestion.includes(data.id) ? 'answering' : ''
                        } ${
                            data.strategy === 'Safeline' ? 'piecesafeline' :
                                data.strategy === 'Lunar' ? 'piecelunar' :
                                    data.strategy === 'Domino House' ? 'piecedomino' :
                                        data.strategy === 'Klaphatten' ? 'pieceklaphatten' :
                                            data.strategy === 'Top of the World' ? 'pieceworld' :
                                                data.strategy === 'Jysk Telepartner' ? 'piecejysk' : ''}`
                        }
                        alt=""
                    />
                </button>
            ))}
        </div>
    );
};
export default PlayerProgress;