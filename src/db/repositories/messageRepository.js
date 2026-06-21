import db from "../db.js";


export async function getLastMessages() {
    const res = await db.query(`
        SELECT nickname, text, created_at
        FROM messages
        ORDER BY created_at DESC
            LIMIT 25
    `);

    return res.rows.reverse();
}

export async function createMessage(nickname, msg) {
    await db.query(
        "INSERT INTO messages (nickname, text, created_at) VALUES ($1, $2, NOW())",
        [nickname, msg]
    );
}

