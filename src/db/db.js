import {Pool} from "pg";
import config from "../config.js";


console.log("CONNECTING DATABASE");

const db = new Pool({
    connectionString: config.db_url,
    ssl: {
        rejectUnauthorized: false
    }
});

export default db;