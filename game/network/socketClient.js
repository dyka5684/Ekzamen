import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token, handlers = {}) {
    if (socket) {
        socket.disconnect();
    }

    socket = io({
        auth: { token }
    });

    socket.on("init", handlers.onInit);
    socket.on("world:update", handlers.onWorld);
    socket.on("player:joined", handlers.onPlayerJoined);
    socket.on("player:left", handlers.onPlayerLeft);
    socket.on("chat:message", handlers.onChat);
    socket.on("chat:error", handlers.onChatError);

    return socket;
}

export function getSocket() {
    return socket;
}