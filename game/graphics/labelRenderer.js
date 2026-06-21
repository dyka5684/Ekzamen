import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export function createLabelRenderer(container) {
    const renderer = new CSS2DRenderer();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.pointerEvents = "none";

    container.appendChild(renderer.domElement);

    return renderer;
}