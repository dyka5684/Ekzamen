import { createMessage } from "../../db/repositories/messageRepository.js";
import { validateMessage } from "../../validators/message.js";

export function chatHandler(io, state, socket) {
    socket.on("chat:message", async (text) => {
        const player = state.players[socket.player.id];

        if (!player) {
            socket.emit("chat:error", {
                error: "PLAYER_NOT_FOUND",
                message: "Player does not exist in state"
            });
            return;
        }

        let msgText;

        try {
            msgText = validateMessage(text);
        } catch (e) {
            socket.emit("chat:error", {
                error: "INVALID_MESSAGE",
                message: e.message
            });
            return;
        }

        try {
            await createMessage(player.nickname, msgText);
        } catch (e) {
            console.error("DB_CHAT_INSERT_ERROR:", e);

            socket.emit("chat:error", {
                error: "CHAT_DB_ERROR",
                message: "Failed to save message"
            });

            return;
        }

        io.emit("chat:message", {
            nickname: player.nickname,
            text: msgText,
            created_at: new Date().toISOString()
        });
    });
}