import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { GAME_CONFIG } from "../config/config.js";
import { toRender } from "../core/scale.js";

export function createPlayerEntity(player) {
    const size = toRender(GAME_CONFIG.player.size);

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshStandardMaterial({
            color: player.color
        })
    );

    mesh.position.set(
        toRender(player.position.x),
        size / 2,
        toRender(player.position.z)
    );

    const labelEl = document.createElement("div");

    labelEl.textContent = player.nickname;

    labelEl.style.color = "#ffffff";
    labelEl.style.fontSize = "12px";
    labelEl.style.fontFamily = "Arial, sans-serif";
    labelEl.style.whiteSpace = "nowrap";
    labelEl.style.userSelect = "none";
    labelEl.style.pointerEvents = "none";
    labelEl.style.textShadow =
        "0 0 4px rgba(0, 0, 0, 0.8)";

    const label = new CSS2DObject(labelEl);

    label.position.set(
        0,
        toRender(GAME_CONFIG.player.labelOffsetY),
        0
    );

    mesh.add(label);

    return {
        id: player.id,
        mesh,
        label,

        destroy() {
            label.element.remove();
            mesh.removeFromParent();
        },

        target: {
            x: toRender(player.position.x),
            z: toRender(player.position.z)
        }
    };
}