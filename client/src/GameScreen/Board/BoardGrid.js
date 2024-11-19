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


const BoardGrid = ({moveMade, setMoveMade, setSelectedPawn, selectedPawn, setPosition, setCurrentPlayer, setPlayerColor, playerColor, modView, gameScreen}) => {
    const [startPieces, setStartPieces] = useState([])
    const [validPositions, setValidPositions] = useState([])
    const [updatedPieces, setUpdatedPieces] = useState(false)
    const [joinedColors, setJoinedColors] = useState([])
    const [tileInfo, setTileInfo] = useState([])
    const [tileInfo2, setTileInfo2] = useState([])
    const tilesColorAndPositionRef = useRef(null)
    const [tilePieces, setTilePieces] = useState({});

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
            console.log("debugggg " );
            if (startPieces.includes(event.target.id)) {
                event.target.classList.add('highlight')
            } else if (targetTile && validPositions.includes(targetTile.getAttribute('data-pos'))
                && targetTile.classList.contains('blink')) {
                const newPosition = targetTile.getAttribute('data-pos')
                if (validPositions.includes(newPosition) && !moveMade) {
                    if (selectedPawn instanceof HTMLElement) {
                        event.target.appendChild(selectedPawn)
                        const color = targetTile.className.split(' ')[1]
                        sendQuestionRequest(color)
                        //setMoveMade(true)
                        document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('blink'))
                        socket.emit('update_player_position', {newPosition: newPosition, selectedPawn: selectedPawn.id});
                    } else {
                        console.error("Selected pawn is not a valid DOM element")
                    }
                }
            }
        }



       handleTileInfoUpdate(socket,setTileInfo);
       handleTileInfo2Update(socket,setTileInfo2);
       handleValidPositionsUpdate(socket,setValidPositions);
       handlePieceAddition(socket,setStartPieces,setJoinedColors);
       handlePositionUpdate(socket,validPositions,setPosition);


        if (gameScreen){
           handleCurrentPlayerRegistration(socket,setCurrentPlayer,setPlayerColor);
            const boardGrid = document.querySelector('.board-grid')
            if (boardGrid !== null){
                boardGrid.addEventListener('click', handleTileClick)
            }
        }
        console.log('re-rendering due to update')
        return () => {
            cleanUpSocketListeners(socket);
        };
    }, [moveMade, validPositions, selectedPawn, setMoveMade, setPosition, setSelectedPawn, setCurrentPlayer, setPlayerColor, playerColor, gameScreen])



    useEffect(() => {
        if (!updatedPieces) {
            if (modView) {
                socket.emit('get_pieces', 'mod');
                socket.emit('get_data', 'leaderboard_update');
            } else {
                socket.emit('get_pieces', 'player');
                socket.emit('get_data', 'leaderboard_update');
                socket.emit('get_playerstrategy', 'player');
            }
            setUpdatedPieces(true); // Mark pieces as updated after emitting events
        }

    }, [])

    if (tileInfo.length === 0 || tileInfo2.length === 0){
        socket.emit('get_tileInfo')
        socket.emit('get_tileInfo2')
       // return <div> Loading...</div>
    }


    for (let index = 0; index < tileInfo.length; index++) {

         const color = assignColorToTile(index,joinedColors,tileInfo,tileInfo2);
         const isHighlighted = highLightChecker(index,possiblePositions,validPositions);
         const tileClass = `tile ${color} ${isHighlighted ? 'blink' : ''}`
         const position = possiblePositions[index];

         const tile = Tile({index,position,tileClass,renderStartPieces,startPieces, selectedPawn});
         tiles.push(tile);
        }


    return (
            <div className='board-grid'>
                {tiles}
            </div>
    )
}




export default BoardGrid