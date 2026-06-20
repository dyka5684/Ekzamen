export function createGameState() {
    return {
        players: {},
        onlineNicknames: new Set(),
        userSocketMap: new Map()
    };
}