export function moveHandler(state, socket) {
    socket.on("player:input", (input) => {
        const player = state.players[socket.player.id];
        if (!player) return;

        player.input = {
            up: !!input.up,
            down: !!input.down,
            left: !!input.left,
            right: !!input.right
        };
    });
}