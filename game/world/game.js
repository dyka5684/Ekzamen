import { createScene } from "../graphics/scene.js";
import { createRenderer } from "../graphics/renderer.js";
import { createCamera } from "../graphics/camera.js";
import { setupResize } from "../graphics/resize.js";

import { createWorld } from "./world.js";
import { createPlayerManager } from "../core/playerManager.js";
import { createInputController } from "../core/inputController.js";

import { connectSocket } from "../network/socketClient.js";

import {
    initChat,
    addChatMessage,
    clearChat,
    setVisible as setChatVisible
} from "../ui/chatPanel.js";

import {
    initChatInput,
    setVisible as setChatInputVisible
} from "../ui/chatInput.js";

import {
    initNotifications,
    showNotification
} from "../ui/notifications.js";
import {createLabelRenderer} from "../graphics/labelRenderer.js";

export function createGame({
                               viewport,
                               chatContainer,
                               chatInputContainer,
                               messageInput,
                               sendBtn,
                               notificationsContainer
}) {
    const scene = createScene();
    const renderer = createRenderer(viewport);
    const labelRenderer = createLabelRenderer(viewport);
    const camera = createCamera(viewport);

    createWorld(scene);

    const playerManager = createPlayerManager(scene);
    const input = createInputController();

    setupResize({
        container: viewport,
        camera,
        renderer,
        labelRenderer
    });

    initNotifications(notificationsContainer);
    initChat(chatContainer);
    initChatInput({
        inputEl: messageInput,
        sendBtn,
        container: chatInputContainer,
        onSend: (text) => {
            if (!socket?.connected) return;
            socket.emit("chat:message", text);
        }
    });

    let socket = null;
    let inputInterval = null;

    function notify(message) {
        showNotification(message);
    }

    function startInputLoop() {
        if (inputInterval) clearInterval(inputInterval);

        inputInterval = setInterval(() => {
            if (!socket?.connected) return;

            socket.emit("player:input", input.getState());
        }, 50);
    }

    function connect(token) {
        socket = connectSocket(token, {
            onInit(payload) {
                playerManager.updatePlayers(payload.players);

                clearChat();

                if (Array.isArray(payload.chat)) {
                    payload.chat.forEach(addChatMessage);
                }
            },

            onWorld(payload) {
                playerManager.updatePlayers(payload.players);
            },

            onPlayerJoined(player) {
                playerManager.addPlayer(player);
            },

            onPlayerLeft(id) {
                playerManager.removePlayer(id);
            },

            onChat(message) {
                addChatMessage(message);
            },
            onChatError(error) {
                notify(error.message);
            }
        });

        setChatVisible(true);
        setChatInputVisible(true);

        startInputLoop();
    }

    function loop() {
        requestAnimationFrame(loop);

        playerManager.interpolate();

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }

    loop();

    return {
        connect,
        input,
        notify
    };
}