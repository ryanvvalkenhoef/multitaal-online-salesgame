import {socket} from "../../client";
import React from "react";

export const renderStartPieces = (startPieces, selectedPawn) => {
   // if (!updatedPieces) {
        //if (modView) {
       //
       //      socket.emit('get_pieces', 'mod')
       //      socket.emit('get_data', 'leaderboard_update')
       //      setUpdatedPieces(true)
       // // } else {
       //      socket.emit('get_pieces', 'player')
       //      socket.emit('get_data', 'leaderboard_update')
       //      socket.emit('get_playerstrategy', 'player')
            //setUpdatedPieces(true)

       // }


    return startPieces.map((piece, index) => {
        const isSelected = selectedPawn && selectedPawn.id !== piece
        const pieceClasses = `startpieces piece${piece} ${isSelected ? 'black-border-piece' : ''}`
        return (
            <div key={index}
                 className={pieceClasses}
                 id={`${piece}`}>
                {selectedPawn && selectedPawn.id === piece &&
                    <div className="gradient-background round-border"></div>}
            </div>
        )
    })


}
