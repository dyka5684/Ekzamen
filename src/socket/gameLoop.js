import { applyMovement } from "../../shared/movement/movementHelpers.js";
import {TICK_MS, TICK_RATE} from "../../shared/constants.js";


export function startGameLoop(io, state) {
    setInterval(() => {
        const dt = 1 / TICK_RATE;

        for (const player of Object.values(state.players)) {
            applyMovement(player, dt);
        }

        io.emit("world:update", {
            players: state.players
        });
    }, TICK_MS);
}