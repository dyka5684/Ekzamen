let inputEl = null;
let sendBtn = null;
let onSendCallback = null;
let containerEl = null;

export function initChatInput({
                                  inputEl: _inputEl,
                                  sendBtn: _sendBtn,
                                  onSend,
                                  container
                              }) {
    inputEl = _inputEl;
    sendBtn = _sendBtn;
    onSendCallback = onSend;
    containerEl = container;

    containerEl.style.display = "none";

    function send() {
        const text = inputEl.value.trim();
        if (!text) return;

        onSendCallback?.(text);
        inputEl.value = "";
    }

    function handleKeyDown(e) {
        if (e.key !== "Enter") return;
        if (document.activeElement !== inputEl) return;
        send();
    }

    sendBtn.addEventListener("click", send);
    inputEl.addEventListener("keydown", handleKeyDown);
}

export function setVisible(value) {
    if (!containerEl) return;
    containerEl.style.display = value ? "flex" : "none";
}