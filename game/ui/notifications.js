let container = null;

export function initNotifications(element) {
    container = element;
}

export function showNotification(text) {
    if (!container) return;

    const div = document.createElement("div");

    div.className = "notification";
    div.textContent = text;

    container.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 4000);
}