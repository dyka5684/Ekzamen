export function createLoginView() {
    const nicknameInput = document.getElementById("nickname");
    const loginBtn = document.getElementById("loginBtn");
    const loginContainer = document.getElementById("login");

    function getNickname() {
        return nicknameInput.value.trim();
    }

    function onLoginClick(handler) {
        loginBtn.addEventListener("click", async () => {
            handler(getNickname());
        });
    }

    function hide() {
        loginContainer.style.display = "none";
    }

    function show() {
        loginContainer.style.display = "flex";
    }

    return {
        getNickname,
        onLoginClick,
        hide,
        show
    };
}