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
    const [isPlayerAnsweringQuestion, setIsPlayerAnsweringQuestion] = useState([]);
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
            setIsPlayerAnsweringQuestion((playerIdState) => {
                if (data.isAnsweringQuestion) {
                    // Add the player to the list if not already present
                    return playerIdState.includes(data.playerId) ? playerIdState : [...playerIdState, data.playerId];
                } else {
                    // Remove the player from the list if they stop answering
                    return playerIdState.filter((id) => id !== data.playerId);
                }
            });
        });



        return () => {
            socket.off('player_answering_question');
        };
    }, []);

    return (
        <div className="player-progress-container">
            <label className="progress-label"> Player Progression: </label>
            {sortedUserData.map((data, index) => (
                <button key={data.id} className={`image-button ${isPlayerAnsweringQuestion.includes(data.id) ? 'answering' : ''}`}
                        onClick={() => onImageClick(index)}>
                    <img
                        src={strategyImages[data.strategy]}
                        className={`image ${
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