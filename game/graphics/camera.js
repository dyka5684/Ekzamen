import * as THREE from "three";

import { GAME_CONFIG } from "../config/config.js";

export function createCamera(container) {
    const camera = new THREE.PerspectiveCamera(
        GAME_CONFIG.camera.fov,
        container.clientWidth / container.clientHeight,
        GAME_CONFIG.camera.near,
        GAME_CONFIG.camera.far
    );

    camera.position.set(
        GAME_CONFIG.camera.position.x,
        GAME_CONFIG.camera.position.y,
        GAME_CONFIG.camera.position.z
    );

    const lookAt = GAME_CONFIG.camera.lookAt;

    camera.lookAt(
        lookAt.x,
        lookAt.y,
        lookAt.z
    );

    return camera;
}