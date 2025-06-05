const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const socketInit = require("./socket/socketInit");
const sockets = require("./socketEvents/Sockets");
const gameSockets = require("./socketEvents/Sockets");

const server = http.createServer(app);
const { instrument } = require("@socket.io/admin-ui");

const io = socketInit(server);
sockets(io);
//gameSockets(io);

app.use(cors());
instrument(io, {
  auth: false,
  mode: "development",
});
server.listen(3001, () => {
  console.log("server is running on port 3001");
});
