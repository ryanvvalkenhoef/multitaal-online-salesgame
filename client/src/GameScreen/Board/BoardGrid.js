import React, {useEffect, useState,useRef} from "react"
import './BoardGridStyle.css'
import {socket} from "../../client"
import {
    cleanUpSocketListeners,
    handlePositionsUpdate,
    handleValidPositionsUpdate,
} from "./eventListenersBoard";
import {createTiles, handleTileClick, setPiecesOnTile, setStartPiecesOnTile} from "./boardFunctions";




const BoardGrid = ({selectedPawn, setPosition, playerColor, gameScreen,tileInfo,tileInfo2,joinedColors,startPieces,piecePositions,setIsBoardRendered}) => {
    const [validPositions, setValidPositions] = useState([])
    const[tilesUseState, setTilesUseState] = useState([]);
    const [isFirstRender, setIsFirstRender] = useState(true);


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

    useEffect(() => {
        handleValidPositionsUpdate(socket,setValidPositions);
        handlePositionsUpdate(socket,validPositions,setPosition, (data) => setPosition(data));
        setIsBoardRendered(true);

        return () => {
            cleanUpSocketListeners(socket);
        };
    }, []);

    useEffect(() => {

        const boardGrid = document.querySelector('.board-grid')
        if (gameScreen && boardGrid !== null){
            boardGrid.addEventListener('click', (event) =>
                handleTileClick({ event, startPieces, selectedPawn, validPositions,playerColor,setPosition })
            );

        }

        console.log('Board re-rendering due to update')

    }, [validPositions])

    useEffect(()=>{// The code in this useEffect is creating the tiles
       const tiles = createTiles({joinedColors,tileInfo,tileInfo2,possiblePositions,validPositions,startPieces,selectedPawn,piecePositions});
       setTilesUseState(tiles);//tiles need to be put in useState in order to render the board.

    }, [joinedColors,validPositions])


    useEffect(()=>{
        // During the first render the tiles are not yet loaded into the DOM
        // Because of that, the pieces can't be set on the first render.
        if(!isFirstRender) {
            if (piecePositions[0] === "") {
                setStartPiecesOnTile({startPieces})
            } else {
                setPiecesOnTile({piecePositions})
            }
        }

    },[piecePositions,isFirstRender])

    useEffect(()=>{
        setIsFirstRender(false)
    },[])


    return (
            <div className='board-grid'>
                {tilesUseState}
            </div>
    )
}


export default BoardGrid