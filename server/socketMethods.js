class SocketManager {

    constructor(io) {
        this.io = io;
    }


    emitToPlayers = (socket, event, data) => {

        if (socket !== null && socket !== undefined) {
            const room = `${socket.room}players`
            this.io.to(room).emit(event, data)
        } else {
            console.log("No connection with socket");
        }
    }


    emitToMod = (socket, event, data) => {

        if (socket !== null && socket !== undefined) {
            const room = `${socket.room}mod`
            this.io.to(room).emit(event, data)
        } else {
            console.log("No connection with socket");
        }
    }


    emitToRoom = (socket, event, data) => {

        if (socket !== null && socket !== undefined) {
            emitToPlayers(socket, event, data);
            emitToMod(socket, event, data);
        } else {
            console.log("No connection with socket");
        }
    }
    

}

module.exports = SocketManager;




