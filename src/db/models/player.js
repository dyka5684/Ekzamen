import db from "../db.js";


export async function findPlayerByNickname(nickname) {
    const result = await db.query(
        `
            SELECT *
            FROM players
            WHERE nickname = $1
        `,
        [nickname]
    );

    return result.rows[0];
}

export async function createPlayer(nickname) {
    const result = await db.query(
        `
            INSERT INTO players (nickname)
            VALUES ($1)
                RETURNING *
        `,
        [nickname]
    );

    return result.rows[0];
}