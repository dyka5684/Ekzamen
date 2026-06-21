let chatEl = null;

export function initChat(container) {
    chatEl = container;
    chatEl.innerHTML = "";
    chatEl.style.display = "none";
}

export function setVisible(value) {
    if (!chatEl) return;
    chatEl.style.display = value ? "block" : "none";
}

export function addChatMessage(message) {
    if (!chatEl) return;

    const div = document.createElement("div");

    const time = new Date(message.created_at).toLocaleTimeString();

    div.textContent =
        `[${time}] ${message.nickname}: ${message.text}`;

    const isAtBottom =
        chatEl.scrollHeight - chatEl.scrollTop - chatEl.clientHeight < 50;

    chatEl.appendChild(div);

    if (isAtBottom) {
        chatEl.scrollTop = chatEl.scrollHeight;
    }
}

export function clearChat() {
    if (!chatEl) return;
    chatEl.innerHTML = "";
}