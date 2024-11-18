const React = require("react");
const {socket} = require("../../client");

const assignColorToTile = (index, joinedColors, tileInfo, tileInfo2) => {

        let totalColors = joinedColors.length;
        let currentColor = joinedColors[0];
        let colorRanges = {
            //Blueprint for tile color assignment. If playing with 6 players for example
            //the yellow tiles will be tiles 1, and 7. Green tiles 2 and 8 etc
            0: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            1: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
            2: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]],
            3: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],
            4: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]],
            5: [[1], [2], [3], [4], [5]],
            6: [[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]]
        }
        let currentTileInfo = (totalColors === 5) ? tileInfo2 : tileInfo;

        //If not a black tile a color is returned
        if (currentTileInfo[index].startsWith('color')) {
            let temp = parseInt(currentTileInfo[index].replace('color', ''));
            for (let range = 0; range < colorRanges[totalColors].length; range++) {
                if (colorRanges[totalColors][range].includes(temp)) {
                    return joinedColors[range];

                }
            }
        } else { // black tile
            return  currentTileInfo[index];
        }

}

const highLightChecker = (index,possiblePositions,validPositions) =>{
    //Function checks if valid position is actually possible and should be highlighted
    //One of the valid positions could for example be outside of grid
    //and thus is not included in possiblePositions
    const position = possiblePositions[index];
    return validPositions.includes(position);
}

// const initalBoardRender = ()=>{
//
// }




module.exports = {
    assignColorToTile,
    highLightChecker,
}