import React from "react";
import { Piece } from "../../components/UI/Piece";

class PieceUtils {

    constructor() {}

    renderStartPieces = (startPieces, selectedPawn) => {
        return startPieces.map((piece, index) => {
          //const isSelected = selectedPawn && selectedPawn.id !== piece //If isSelected is true piece gets rainbow border
          const isSelected = true;
          const pieceClass = `startpieces piece${piece} ${isSelected ? "black-border-piece" : ""}`;
          return Piece({ piece, isSelected, pieceClass });
        });
      };
}

module.exports = PieceUtils;
