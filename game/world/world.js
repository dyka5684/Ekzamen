import * as THREE from "three";
import { GAME_CONFIG } from "../config/config.js";
import { toRender } from "../core/scale.js";

export function createWorld(scene) {
    const size = toRender(GAME_CONFIG.world.size);

    const grid = new THREE.GridHelper(
        size * GAME_CONFIG.grid.divisionsMultiplier,
        GAME_CONFIG.world.size * GAME_CONFIG.grid.divisionsMultiplier
    );

    scene.add(grid);

    const ambientLight = new THREE.AmbientLight(
        GAME_CONFIG.colors.ambientLight,
        GAME_CONFIG.lights.ambientIntensity
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
        GAME_CONFIG.colors.directionalLight,
        GAME_CONFIG.lights.directionalIntensity
    );

    directionalLight.position.set(
        GAME_CONFIG.lights.directionalPosition.x,
        GAME_CONFIG.lights.directionalPosition.y,
        GAME_CONFIG.lights.directionalPosition.z
    );

    scene.add(directionalLight);
}