import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { authenticateSocket } from "./socket.middleware.js";
import { registerSocketEvents } from "./socket.events.js";

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

io.on("connection", (socket) => {
  registerSocketEvents(io, socket);
});

  return io;
};
