import { WORLD_SIZE } from "../../shared/constants.js";

export const GAME_CONFIG = {
    world: {
        size: WORLD_SIZE
    },

    render: {
        scale: 1
    },

    camera: {
        fov: 60,
        near: 0.1,
        far: 2000,

        position: {
            x: 0,
            y: 90,
            z: 90
        },

        lookAt: {
            x: 0,
            y: 0,
            z: 0
        }
    },

    renderer: {
        antialias: true,
        pixelRatioLimit: 2
    },

    grid: {
        divisionsMultiplier: 2
    },

    player: {
        size: 1,
        labelOffsetY: 1.2
    },

    interpolation: {
        factor: 0.2
    },

    colors: {
        background: 0x111111,
        ambientLight: 0xffffff,
        directionalLight: 0xffffff
    },

    lights: {
        ambientIntensity: 1.5,
        directionalIntensity: 2,
        directionalPosition: {
            x: 20,
            y: 50,
            z: 20
        }
    }
};