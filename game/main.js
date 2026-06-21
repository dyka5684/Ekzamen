import { createGame } from "./world/game.js";
import { createLoginView } from "./ui/loginView.js";
import { loginRequest } from "./network/authClient.js";



const game = createGame({
    viewport: document.getElementById("viewport"),
    chatContainer: document.getElementById("chat"),
    chatInputContainer: document.getElementById("chatInput"),
    messageInput: document.getElementById("messageInput"),
    sendBtn: document.getElementById("sendBtn"),
    notificationsContainer: document.getElementById("notifications")
});



const loginView = createLoginView();

loginView.onLoginClick(async (nickname) => {
    if (!nickname) return;

    try {
        const token = await loginRequest(nickname);

        game.connect(token);

        loginView.hide();
    } catch (e) {
        game.notify(
            e?.message || "Login failed"
        );
    }
});