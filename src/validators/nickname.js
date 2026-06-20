export function validateNickname(nickname) {
    if (typeof nickname !== "string") {
        throw new Error("Nickname must be string");
    }

    const name = nickname.trim();

    if (name.length < 3 || name.length > 20) {
        throw new Error("Nickname must be 3-20 characters");
    }

    return name;
}
