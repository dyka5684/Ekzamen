import Fastify from "fastify";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: false });

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "dist"),
    index: ["index.html"]
});

const PORT = process.env.port;

await fastify.listen({ port: PORT });

console.log(`Server started`);





