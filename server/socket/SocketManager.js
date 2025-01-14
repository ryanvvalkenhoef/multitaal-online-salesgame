class SocketManager {
  #io;

  constructor(io) {
    this.#io = io;
  }

  emitToPlayers = (socket, event, data) => {
    if (socket !== null && socket !== undefined) {
      const room = this.#getRoom(socket, "players");
      this.#io.to(room).emit(event, data);
    } else {
      console.log("Socket object in null or undefined");
    }
  };

  emitToMod = (socket, event, data) => {
    if (socket !== null && socket !== undefined) {
      const room = this.#getRoom(socket, "mod");
      this.#io.to(room).emit(event, data);
    } else {
      console.log("Socket object in null or undefined");
    }
  };

  emitToRoom = (socket, event, data) => {
    if (socket !== null && socket !== undefined) {
      const room = this.#getRoom(socket, "room");
      this.#io.to(room).emit(event, data);
    } else {
      console.log("Socket object in null or undefined");
    }
  };

  emitBackToClient = (socket, event, data) => {
    //emits back to the client that emitted to the server

    if (socket !== null && socket !== undefined) {
      const room = this.#getRoom(socket, "client");
      this.#io.to(room).emit(event, data);
    } else {
      console.log("Socket object in null or undefined");
    }
  };

  emitToSpecificSocket = (socketId, event, data) => {
    if (socketId !== null && socketId !== undefined) {
      this.#io.to(socketId).emit(event, data);
    } else {
      console.log("SocketId is null or undefined");
    }
  };

  #getRoom = (socket, receiver) => {
    switch (receiver) {
      case "players":
        return `${socket.room}players`;
      case "mod":
        return `${socket.room}mod`;
      case "room": //emits to players and mod
        return socket.room;
      case "client": // emits back to the client that made connection with the server
        return socket.id;
    }
  };
}

module.exports = SocketManager;
