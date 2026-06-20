import db from "../db.js";


export async function initTables() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            nickname VARCHAR(20) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            nickname VARCHAR(20) NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);

    console.log("INIT TABLES");
}