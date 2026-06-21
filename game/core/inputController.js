export function createInputController() {
    const state = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    const keyMap = {
        KeyW: "up",
        KeyS: "down",
        KeyA: "left",
        KeyD: "right"
    };

    function setKey(e, value) {
        const key = keyMap[e.code];
        if (!key) return false;

        state[key] = value;
        return true;
    }

    function onKeyDown(e) {
        if (setKey(e, true)) e.preventDefault();
    }

    function onKeyUp(e) {
        if (setKey(e, false)) e.preventDefault();
    }

    function reset() {
        state.up = false;
        state.down = false;
        state.left = false;
        state.right = false;
    }

    function bind() {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", reset);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) reset();
        });

        window.addEventListener("contextmenu", e => e.preventDefault());
    }

    bind();

    return {
        getState: () => ({ ...state }),
    };
}