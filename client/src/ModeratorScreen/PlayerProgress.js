import React, { useState, useEffect } from 'react';
import Lunar from '../Assets/LUNAR.png';
import TopOfTheWorld from '../Assets/TopOfTheWorld.png';
import Safeline from '../Assets/SAFELINE.png';
import JyskTelepartner from '../Assets/JYSKTelepartner.png';
import DominoHouse from '../Assets/DominoHouse.png';
import Klaphatten from '../Assets/Klaphatten.png';
import './PlayerProgressStyles.css'
import {socket} from "../client";

const PlayerProgress = ({sortedUserData, onImageClick}) => {
    const [playersAnsweringQuestion, setPlayersAnsweringQuestion] = useState([]);
    const [playersFinishedTurn, setPlayersFinishedTurn] = useState([]);
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
                return playerIdState.includes(data.playerId) ? playerIdState : [...playerIdState, data.playerId];
            });
        });



        return () => {
            socket.off('player_answering_question');
            socket.off('player_has_finished_turn');
        };
    }, []);

    return (
        <div className="player-progress-container">
            <label className="progress-label"> Player Progression: </label>
            {sortedUserData.map((data, index) => (
                <button
                    key={data.id}
                    className="image-button"
                    onClick={() => onImageClick(index)}
                >
                    <img
                        src={strategyImages[data.strategy]}
                        className={`image ${
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