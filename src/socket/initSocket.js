import { Server } from "socket.io";

import { createGameState } from "./gameState.js";
import { socketAuth } from "./socketAuth.js";

import { connectionHandler } from "./handlers/connectionHandler.js";
import { moveHandler } from "./handlers/moveHandler.js";
import { chatHandler } from "./handlers/chatHandler.js";

import { startGameLoop } from "./gameLoop.js";

export function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    });

    const state = createGameState();

    io.use((socket, next) => {
        socketAuth(io, state, socket, next);
    });

    io.on("connection", async (socket) => {
        try {
            await connectionHandler(io, state, socket);

            moveHandler(state, socket);

            chatHandler(io, state, socket);
        } catch (e) {
            console.error("CONNECTION_HANDLER_ERROR:", e);

            socket.disconnect(true);
        }
    });

    startGameLoop(io, state);

    return io;
}