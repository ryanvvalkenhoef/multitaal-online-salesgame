import React from "react"
import '../Board/BoardGridStyle.css'

export const Piece = ({ piece, isSelected, pieceClass}) => {
    console.log("IsSelected: " + isSelected)
    return (
        <div className={pieceClass} id={piece}>
            {isSelected && <div className="gradient-background round-border"></div>}

        </div>
    );
};