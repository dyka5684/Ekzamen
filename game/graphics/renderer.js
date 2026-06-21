import * as THREE from "three";

import { GAME_CONFIG } from "../config/config.js";

export function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({
        antialias: GAME_CONFIG.renderer.antialias
    });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            GAME_CONFIG.renderer.pixelRatioLimit
        )
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);

    return renderer;
}