import React from 'react';
import Lunar from '../Assets/LUNAR.png';
import TopOfTheWorld from '../Assets/TopOfTheWorld.png';
import Safeline from '../Assets/SAFELINE.png';
import JyskTelepartner from '../Assets/JYSKTelepartner.png';
import DominoHouse from '../Assets/DominoHouse.png';
import Klaphatten from '../Assets/Klaphatten.png';
import '../GameScreen/PlayerProgressStyles.css'
const PlayerProgress = () => {
    const images = [Lunar, TopOfTheWorld, Safeline, JyskTelepartner, DominoHouse, Klaphatten];
    return (
        <div>
            {images.map((src, index) => (
                <img className="image" key={index} src={src} alt={`Image ${index + 1}`} />
            ))}
        </div>
    )
}
export default PlayerProgress