import React from "react";
import "../Board/BoardGridStyle.css";

export const Piece = ({ piece, isSelected, pieceClass, index }) => {
  return (
    <div className={pieceClass} id={piece} key={index}>
      {isSelected && <div className="gradient-background round-border"></div>}
    </div>
  );
};
