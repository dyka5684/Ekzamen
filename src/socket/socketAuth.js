import jwtHelper from "../helpers/jwt.js";

export function socketAuth(io, state, socket, next) {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("No token"));
        }

        const payload = jwtHelper.verifyToken(token);

        const existingSocketId = state.userSocketMap.get(payload.id);

        if (existingSocketId) {
            const existingSocket = io.sockets.sockets.get(existingSocketId);

            if (existingSocket) {
                existingSocket.disconnect(true);
            }
        }

        state.userSocketMap.set(payload.id, socket.id);

        socket.player = {
            id: payload.id,
            nickname: payload.nickname
        };

        next();
    } catch {
        next(new Error("Unauthorized"));
    }
}