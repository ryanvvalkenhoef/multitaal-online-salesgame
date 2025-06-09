import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import fs from "fs";
import { instrument } from "@socket.io/admin-ui";
import socketInit from "./socket/socketInit.js";
import sockets from "./socketEvents/Sockets.js";

const app = express();
const server = http.createServer(app);
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
