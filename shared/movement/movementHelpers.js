import { WORLD_SIZE, PLAYER_SPEED } from "../constants.js";

export function applyMovement(player, dt) {
    const input = player.input;

    if (!input) return;

    let dx = 0;
    let dz = 0;

    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dz -= 1;
    if (input.down) dz += 1;

    if (dx === 0 && dz === 0) return;

    const len = Math.hypot(dx, dz);

    dx /= len;
    dz /= len;

    player.position.x += dx * PLAYER_SPEED * dt;
    player.position.z += dz * PLAYER_SPEED * dt;

    player.position.x = clamp(player.position.x);
    player.position.z = clamp(player.position.z);
}

function clamp(v) {
    return Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, v));
}