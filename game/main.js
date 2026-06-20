import { io } from "socket.io-client";

const statusEl = document.getElementById("status");
const playersEl = document.getElementById("players");
const logsEl = document.getElementById("logs");
const chatEl = document.getElementById("chatMessages");

const nicknameInput =
    document.getElementById("nickname");

const loginBtn =
    document.getElementById("loginBtn");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

let socket = null;
let players = {};

function addLog(type, ...args) {
    const row = document.createElement("div");

    row.textContent =
        `[${new Date().toLocaleTimeString()}] ` +
        type +
        " " +
        args.map(format).join(" ");

    logsEl.prepend(row);

    console.log(type, ...args);
}

function addError(...args) {
    const row = document.createElement("div");

    row.className = "error";

    row.textContent =
        `[${new Date().toLocaleTimeString()}] ` +
        args.map(format).join(" ");

    logsEl.prepend(row);

    console.error(...args);
}

function format(value) {
    if (value instanceof Error) {
        return `${value.name}: ${value.message}`;
    }

    if (typeof value === "object" && value) {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
}

function renderPlayers() {
    playersEl.innerHTML = "";

    Object.values(players).forEach(player => {
        const div = document.createElement("div");

        div.textContent =
            `${player.nickname} ` +
            `(${player.position.x}, ${player.position.z})`;

        playersEl.appendChild(div);
    });
}

function addChatMessage(msg) {
    const div = document.createElement("div");

    div.className = "chat-row";

    div.textContent =
        `[${new Date(msg.created_at).toLocaleTimeString()}] ` +
        `${msg.nickname}: ${msg.text}`;

    chatEl.appendChild(div);

    chatEl.scrollTop =
        chatEl.scrollHeight;
}

async function login() {
    const nickname =
        nicknameInput.value.trim();

    if (!nickname) {
        addError("Nickname required");
        return;
    }

    addLog("AUTH", "Login started");

    const response = await fetch(
        `/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                nickname
            })
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        addError(
            "AUTH ERROR",
            response.status,
            data
        );

        return;
    }

    addLog("AUTH SUCCESS", data);

    connectSocket(data.token);
}

function connectSocket(token) {
    if (socket) {
        socket.disconnect();
    }

    socket = io({
        auth: {
            token
        }
    });

    socket.on("connect", () => {
        statusEl.textContent =
            "Connected";

        addLog(
            "CONNECTED",
            socket.id
        );
    });

    socket.on("disconnect", reason => {
        statusEl.textContent =
            "Disconnected";

        addLog(
            "DISCONNECTED",
            reason
        );
    });

    socket.on(
        "connect_error",
        error => {
            addError(
                "SOCKET ERROR",
                error
            );
        }
    );

    socket.on("init", payload => {
        addLog("INIT", payload);

        players =
            payload.players ?? {};

        renderPlayers();

        chatEl.innerHTML = "";

        if (
            Array.isArray(
                payload.chat
            )
        ) {
            payload.chat.forEach(
                addChatMessage
            );
        }
    });

    socket.on(
        "world:update",
        payload => {
            players =
                payload.players;

            renderPlayers();
        }
    );

    socket.on(
        "player:joined",
        player => {
            addLog(
                "PLAYER JOINED",
                player.nickname
            );
        }
    );

    socket.on(
        "player:left",
        id => {
            addLog(
                "PLAYER LEFT",
                id
            );
        }
    );

    socket.on(
        "chat:message",
        message => {
            addChatMessage(message);
        }
    );

    socket.on(
        "chat:error",
        error => {
            addError(
                "CHAT ERROR",
                error
            );
        }
    );

    setupInput();
}

function setupInput() {
    const input = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    function sendInput() {
        if (!socket?.connected) {
            return;
        }

        socket.emit(
            "player:input",
            input
        );
    }

    function resetInput() {
        input.up = false;
        input.down = false;
        input.left = false;
        input.right = false;

        sendInput();
    }

    window.addEventListener(
        "blur",
        resetInput
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden
            ) {
                resetInput();
            }
        }
    );

    window.onkeydown = e => {
        switch (e.code) {
            case "KeyW":
                input.up = true;
                break;

            case "KeyS":
                input.down = true;
                break;

            case "KeyA":
                input.left = true;
                break;

            case "KeyD":
                input.right = true;
                break;

            default:
                return;
        }

        sendInput();
    };

    window.onkeyup = e => {
        switch (e.code) {
            case "KeyW":
                input.up = false;
                break;

            case "KeyS":
                input.down = false;
                break;

            case "KeyA":
                input.left = false;
                break;

            case "KeyD":
                input.right = false;
                break;

            default:
                return;
        }

        sendInput();
    };
}

loginBtn.addEventListener(
    "click",
    () => login().catch(addError)
);

function sendChat() {
    if (!socket?.connected) {
        addError(
            "Not connected"
        );

        return;
    }

    const text =
        messageInput.value.trim();

    if (!text) {
        return;
    }

    socket.emit(
        "chat:message",
        text
    );

    messageInput.value = "";
}

sendBtn.addEventListener(
    "click",
    sendChat
);

messageInput.addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") {
            sendChat();
        }
    }
);