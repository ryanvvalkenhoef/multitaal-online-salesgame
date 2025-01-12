import React, { useEffect } from "react";
import { Piece } from "./Piece";
import { socket } from "../../client";

export default function Pieces({ startPieces, setArePiecesRendered }) {
  useEffect(() => {
    setArePiecesRendered(true);
    socket.emit("link_player_to_piece");
  }, []);

  return createStartPieces(startPieces, null);
}

const createStartPieces = (startPieces, selectedPawn) => {
  return startPieces.map((piece, index) => {
    //const isSelected = selectedPawn && selectedPawn.id !== piece //If isSelected is true piece gets rainbow border
    const isSelected = true;
    const pieceClass = `startpieces piece${piece} ${isSelected ? "black-border-piece" : ""}`;
    return Piece({ piece, isSelected, pieceClass, index });
  });
};
