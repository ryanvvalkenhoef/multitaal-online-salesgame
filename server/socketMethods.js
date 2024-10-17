const emitToPlayers = (socket,event,data) =>{

    if(socket !== null && socket !== undefined) {
        const room = `${socket.room}players`
        io.to(room).emit(event, data)
    }
    else {
        console.log()
    }
}