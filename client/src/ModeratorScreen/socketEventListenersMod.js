
export const handleReceivePlayerAnswer = ({socket,reviewQuestion}) =>{
    socket.on('receive_player_answer', (questionData)=> { //parameter is an object
        console.log("In receive player event/")
        reviewQuestion(questionData)
    })
}

export const cleanUpSocketListeners = (socket) =>{
    socket.off("send_tileInfo");
    socket.off("send_tileInfo2");
    socket.off("add_player_color");
    socket.off('add_piece');
    socket.off('rounds');
    socket.off('update_leaderboard');
    socket.off('receive_player_answer');
    socket.off('game_over');

}


export {
    handleColorAddition,
    handlePieceAddition,
    handleTileInfo2Update,
    handleTileInfoUpdate,
    handlePositionsUpdate,
    handleUpdateRound,
    handleGameOverEvent,
    handleLeaderBoardUpdate,
    handleGoToHomeScreen
} from '../PlayerScreen/socketEventListenersPlayer'
