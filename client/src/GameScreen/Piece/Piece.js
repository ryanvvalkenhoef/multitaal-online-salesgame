import React from "react"
import '../Board/BoardGridStyle.css'

export const Piece = ({ piece, isSelected, onClick }) => {
    const pieceClasses = `startpieces piece${piece} ${isSelected ? "black-border-piece" : ""}`;

    return (
        <div className={pieceClasses} id={piece} onClick={onClick}>
            {isSelected && <div className="gradient-background round-border"></div>}
        </div>
    );
};