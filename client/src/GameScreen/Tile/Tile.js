import React from "react"
import '../Board/BoardGridStyle.css'
import {renderStartPieces} from "../Piece/functions";

export const Tile = ({ position, tileClass ,index ,renderStartPieces,startPieces, selectedPawn}) => {


        if(position === '8-5') {
           return( <div key={index} className={tileClass} data-pos={position}>
                   {renderStartPieces(startPieces,selectedPawn)}
            </div>
           )
        }

        else {
            return( <div key={index} className={tileClass} data-pos={position}></div>
            )
        }



};






