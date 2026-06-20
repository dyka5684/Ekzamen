import Fastify from "fastify";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import db from "./src/db/db.js";
import {initTables} from "./src/db/setup/init.js";
import pingRoute from "./src/routes/pingRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: false });

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "dist"),
    index: ["index.html"]
});

await fastify.register(pingRoute)


try {
    const result = await db.query("SELECT NOW()");
    await initTables();
    console.log("DB CONNECT", result.rows[0]);
} catch (e) {
    console.error("DB ERROR", e);
}



const PORT = process.env.port;

await fastify.listen({ port: PORT });

console.log(`Server started`);





