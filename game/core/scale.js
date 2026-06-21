import { GAME_CONFIG } from "../config/config.js";

export function toRender(value) {
    return value * GAME_CONFIG.render.scale;
}

export function toWorld(value) {
    return value / GAME_CONFIG.render.scale;
}