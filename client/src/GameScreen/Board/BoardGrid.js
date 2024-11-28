import React, {useEffect, useState,useRef} from "react"
import './BoardGridStyle.css'
import {socket} from "../../client"
import { json } from "react-router-dom"
import {
    handlePieceAddition,
    handleTileInfoUpdate,
    handleTileInfo2Update,
    cleanUpSocketListeners,
    handlePositionUpdate,
    handleValidPositionsUpdate,
    handleCurrentPlayerRegistration
} from "./socketEventListeners";
import {assignColorToTile, highLightChecker} from "./functions";
import {Tile} from "../Tile/Tile.js";
import {Piece} from "../Piece/Piece.js";
import {renderStartPieces} from "../Piece/functions";


const BoardGrid = ({selectedPawn, setPosition, setCurrentPlayer, setPlayerColor, playerColor, modView, gameScreen,tileInfo,tileInfo2,joinedColors,startPieces}) => {
    const [validPositions, setValidPositions] = useState([])
    const [isReadyToRender, setIsReadyToRender] = useState(false);
    const[tilesUseState, setTilesUseState] = useState([]);


    //CO-ORDINATES FOR PAWN MOVEMENT
    const possiblePositions = [
        "1-9", "2-9", "3-9", "4-9", "5-9", "6-9", "7-9", "8-9", "9-9", "10-9", "11-9", "12-9", "13-9", "14-9", "15-9",
        "1-8", "", "", "", "", "", "", "8-8", "", "", "", "", "", "", "15-8",
        "1-7", "", "", "", "", "", "", "8-7", "", "", "", "", "", "", "15-7",
        "1-6", "", "", "", "", "", "", "8-6", "", "", "", "", "", "", "15-6",
        "1-5", "2-5", "3-5", "4-5", "5-5", "6-5", "7-5", "8-5", "9-5", "10-5", "11-5", "12-5", "13-5", "14-5", "15-5",
        "1-4", "", "", "", "", "", "", "8-4", "", "", "", "", "", "", "15-4",
        "1-3", "", "", "", "", "", "", "8-3", "", "", "", "", "", "", "15-3",
        "1-2", "", "", "", "", "", "", "8-2", "", "", "", "", "", "", "15-2",
        "1-1", "2-1", "3-1", "4-1", "5-1", "6-1", "7-1", "8-1", "9-1", "10-1", "11-1", "12-1", "13-1", "14-1", "15-1",
    ]

    //EMPTY ARRAY NECESSARY FOR RENDERING TILES
    const tiles = []


    const sendQuestionRequest = (colorTile) => {
        socket.emit("send_question_request", { questionColor: colorTile, userColor: playerColor })
    }

    useEffect(() => {
        const handleTileClick = event => {
            const targetTile = event.target.closest('.tile')
            if (startPieces.includes(event.target.id)) {
                event.target.classList.add('highlight')
            } else if (targetTile && validPositions.includes(targetTile.getAttribute('data-pos'))
                && targetTile.classList.contains('blink')) {
                const newPosition = targetTile.getAttribute('data-pos')
                if (validPositions.includes(newPosition)) {
                    if (selectedPawn instanceof HTMLElement) {
                        event.target.appendChild(selectedPawn)
                        const color = targetTile.className.split(' ')[1]
                        sendQuestionRequest(color)
                        document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'))
                        socket.emit('update_player_position', {newPosition: newPosition, selectedPawn: selectedPawn.id});
                    } else {
                        console.error("Selected pawn is not a valid DOM element")
                    }
                }
            }
        }


        handleValidPositionsUpdate(socket,setValidPositions);
        handlePositionUpdate(socket,validPositions,setPosition, (data) => setPosition(data))


        if (gameScreen){
           handleCurrentPlayerRegistration(socket,setCurrentPlayer,setPlayerColor);
            const boardGrid = document.querySelector('.board-grid')
            if (boardGrid !== null){
                boardGrid.addEventListener('click', handleTileClick)
            }
        }
        console.log('Board re-rendering due to update')
        return () => {
            cleanUpSocketListeners(socket);
        };
    }, [validPositions])

    useEffect(()=>{




            for (let index = 0; index < tileInfo.length; index++) {


                const color = assignColorToTile(index, joinedColors, tileInfo, tileInfo2);
                const isHighlighted = highLightChecker(index, possiblePositions, validPositions);
                const tileClass = `tile ${color} ${isHighlighted ? 'blink' : ''}`
                const position = possiblePositions[index];

                const tile = Tile({index, position, tileClass, renderStartPieces, startPieces, selectedPawn});
                tiles.push(tile);
            }
            console.log('isReadytoRender: ', isReadyToRender);
            console.log("colors: ", joinedColors);
            setTilesUseState(tiles);

        return () => {
            socket.off('connect');
        };
    }, [joinedColors,validPositions])

    return (
            <div className='board-grid'>
                {tilesUseState}
            </div>
    )
}


export default BoardGrid