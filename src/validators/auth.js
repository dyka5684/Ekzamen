
export function isInvalidNickname(nickname) {
    return (
        !nickname ||
        typeof nickname !== "string" ||
        nickname.trim().length === 0 ||
        nickname.length > 20
    )

}