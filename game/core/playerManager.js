import { createPlayerEntity } from "../entities/player.js";
import { GAME_CONFIG } from "../config/config.js";
import { toRender } from "./scale.js";

export function createPlayerManager(scene) {
    const players = new Map();

    function addPlayer(player) {
        let entity = players.get(player.id);

        if (entity) {
            return entity;
        }

        entity = createPlayerEntity(player);

        scene.add(entity.mesh);
        players.set(player.id, entity);

        return entity;
    }

    function removePlayer(id) {
        const entity = players.get(id);

        if (!entity) return;

        entity.destroy();

        players.delete(id);
    }

    function updatePlayers(serverPlayers) {
        for (const player of Object.values(serverPlayers)) {
            let entity = players.get(player.id);

            if (!entity) {
                entity = addPlayer(player);
            }

            entity.target.x = toRender(player.position.x);
            entity.target.z = toRender(player.position.z);
        }

        for (const [id] of players) {
            if (!serverPlayers[id]) {
                removePlayer(id);
            }
        }
    }

    function interpolate() {
        for (const entity of players.values()) {
            entity.mesh.position.x +=
                (entity.target.x - entity.mesh.position.x) *
                GAME_CONFIG.interpolation.factor;

            entity.mesh.position.z +=
                (entity.target.z - entity.mesh.position.z) *
                GAME_CONFIG.interpolation.factor;
        }
    }

    return {
        removePlayer,
        updatePlayers,
        interpolate,
        addPlayer
    };
}