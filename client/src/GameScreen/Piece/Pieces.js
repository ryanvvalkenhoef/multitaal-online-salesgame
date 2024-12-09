import React, {useEffect} from "react"
import {Piece} from "./Piece";

export default  function Pieces({startPieces,setArePiecesRendered}) {

    useEffect(() => {
        setArePiecesRendered(true);
    }, []);

    return createStartPieces(startPieces,null);
}


const createStartPieces = (startPieces, selectedPawn) => {

    return startPieces.map((piece, index) => {
        console.log("SelectedPawn: " + selectedPawn)
        ///console.log("SelectedPawn.id: " + selectedPawn.id)
        console.log("Piece: " + piece)
        //const isSelected = selectedPawn && selectedPawn.id !== piece //If isSelected is true piece gets rainbow border
        const isSelected = true;
        console.log("RenderPieces: " + isSelected);
        const pieceClass = `startpieces piece${piece} ${isSelected ? 'black-border-piece' : ''}`
        return Piece({piece,isSelected,pieceClass,index})
    })


}

//
// import React, {useEffect, useState} from "react"
// import {Piece} from "./Piece";
//
// export default  function Pieces({startPieces}) {
//
//     const [delayedPieces, setDelayedPieces] = useState(null); // State to store delayed rendering
//
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDelayedPieces(renderStartPieces(startPieces, null)); // Trigger rendering after 1 second
//         }, 1000); // 1-second delay
//
//         return () => clearTimeout(timer); // Cleanup timeout on component unmount
//     }, [startPieces]); // Re-run effect if startPieces changes
//
//     // Show a placeholder or null until the timeout finishes
//     return delayedPieces || <div>Loading...</div>;
//
// }
//
//
// const renderStartPieces = (startPieces, selectedPawn) => {
//
//     return startPieces.map((piece, index) => {
//         console.log("SelectedPawn: " + selectedPawn)
//         ///console.log("SelectedPawn.id: " + selectedPawn.id)
//         console.log("Piece: " + piece)
//         //const isSelected = selectedPawn && selectedPawn.id !== piece //If isSelected is true piece gets rainbow border
//         const isSelected = true;
//         console.log("RenderPieces: " + isSelected);
//         const pieceClass = `startpieces piece${piece} ${isSelected ? 'black-border-piece' : ''}`
//         return Piece({piece,isSelected,pieceClass})
//     })
//
//
// }



