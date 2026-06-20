import "dotenv/config";
import {Pool} from "pg";


console.log("CONNECTING DATABASE");

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default db;