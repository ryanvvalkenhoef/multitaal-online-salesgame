import React from "react";
import {Piece} from "./Piece";

export const renderStartPieces = (startPieces, selectedPawn) => {

    return startPieces.map((piece, index) => {
        console.log("SelectedPawn: " + selectedPawn)
        ///console.log("SelectedPawn.id: " + selectedPawn.id)
        console.log("Piece: " + piece)
        //const isSelected = selectedPawn && selectedPawn.id !== piece //If isSelected is true piece gets rainbow border
        const isSelected = true;
        console.log("RenderPieces: " + isSelected);
        const pieceClass = `startpieces piece${piece} ${isSelected ? 'black-border-piece' : ''}`
        return Piece({piece,isSelected,pieceClass})
    })


}
