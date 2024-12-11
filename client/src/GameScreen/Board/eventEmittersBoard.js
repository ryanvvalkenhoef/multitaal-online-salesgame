export const sendQuestionRequest = (socket,colorTile,playerColor) => {
    socket.emit("send_question_request", { questionColor: colorTile, userColor: playerColor })
}

