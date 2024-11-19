import React from "react"
import '../Board/BoardGridStyle.css'

export const Piece = ({ piece, isSelected }) => {
    const pieceClasses = `startpieces piece${piece} ${isSelected ? "black-border-piece" : ""}`;
    const tile = document.querySelector('.tile[data-pos="8-5"]');

    return (
        <div className={pieceClasses} id={piece}>
            {isSelected && <div className="gradient-background round-border"></div>}

        </div>
    );
};