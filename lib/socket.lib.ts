import http from "http";
import { Server } from "socket.io";

let io: any = null;

const socket = (express: any) => {
  const coreServer = http.createServer(express);
  io = new Server(coreServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  coreServer.listen(8080);

  io.on("connection", (socket: any) => {
    console.log(`User connect with id = ${socket.id}`);
  });

  return io;
};

export default socket;

export const getSocket = () => {
  if (!io) throw new Error("Socket not connected yet");

  return io;
};
