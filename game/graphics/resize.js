export function setupResize({
                                container,
                                camera,
                                renderer,
                                labelRenderer
                            }) {
    function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        if (labelRenderer) {
            labelRenderer.setSize(width, height);
        }
    }

    const observer = new ResizeObserver(() => {
        resize();
    });

    observer.observe(container);

    window.addEventListener("resize", resize);

    resize();

    return {
        dispose() {
            observer.disconnect();
            window.removeEventListener("resize", resize);
        }
    };
}