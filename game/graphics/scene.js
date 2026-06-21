import * as THREE from "three";

import { GAME_CONFIG } from "../config/config.js";

export function createScene() {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
        GAME_CONFIG.colors.background
    );

    return scene;
}