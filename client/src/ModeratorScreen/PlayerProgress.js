import React from 'react';
import Lunar from '../Assets/LUNAR.png';
import TopOfTheWorld from '../Assets/TopOfTheWorld.png';
import Safeline from '../Assets/SAFELINE.png';
import JyskTelepartner from '../Assets/JYSKTelepartner.png';
import DominoHouse from '../Assets/DominoHouse.png';
import Klaphatten from '../Assets/Klaphatten.png';
import './PlayerProgressStyles.css'

const PlayerProgress = ({sortedUserData, onImageClick}) => {

    const strategyImages = {
        'Safeline': Safeline,
        'Lunar': Lunar,
        'Domino House': DominoHouse,
        'Klaphatten': Klaphatten,
        'Top of the World': TopOfTheWorld,
        'Jysk Telepartner': JyskTelepartner
    };

    return (
        <div className="player-progress-container">
            <label className="progress-label"> Player Progression: </label>
            {sortedUserData.map((data, index) => (
                <button key={data.id} className="image-button" onClick={() => onImageClick(index)}>
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