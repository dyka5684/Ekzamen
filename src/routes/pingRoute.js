
export default async function pingRoute(fastify) {
    fastify.get("/ping", (_, reply) => {
        return reply.send("pong");
    });
}