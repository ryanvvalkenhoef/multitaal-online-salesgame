import { Server } from "socket.io";

export default function (server) {
  return new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  // VOOR DEPLOYMENT
  // return new Server(server, {
  //     connectionStateRecovery: true,
  //     path: '/server',
  //     cors: {
  //         origin: 'https://thebestsellergame.online',
  //         methods: ['GET', 'POST']
  //     }
  // });
};
