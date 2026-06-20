import { getLastMessages } from "../../db/repositories/messageRepository.js";

export async function connectionHandler(io, state, socket) {
    const id = socket.player.id;

    state.onlineNicknames.add(socket.player.nickname);

    state.players[id] = {
        id,
        nickname: socket.player.nickname,
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        input: {
            up: false,
            down: false,
            left: false,
            right: false
        },
        color: randomColor()
    };

    const messages = await getLastMessages();

    socket.emit("init", {
        selfId: id,
        players: state.players,
        chat: messages
    });

    socket.broadcast.emit(
        "player:joined",
        state.players[id]
    );

    socket.on("disconnect", () => {
        delete state.players[id];

        state.onlineNicknames.delete(socket.player.nickname);

        state.userSocketMap.delete(id);

        io.emit("player:left", id);
    });
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}