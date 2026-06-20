export function validateMessage(text) {
    if (text === undefined || text === null) {
        throw new Error("Message is required");
    }

    if (typeof text !== "string") {
        throw new Error("Message must be a string");
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
        throw new Error("Message cannot be empty");
    }

    if (trimmed.length > 200) {
        throw new Error("Message max length is 200 characters");
    }

    return trimmed;
}