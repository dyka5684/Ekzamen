import { createPlayer, findPlayerByNickname } from "../db/repositories/playerRepository.js";
import jwtHelper from "../helpers/jwt.js";
import { validateNickname } from "../validators/nickname.js";

export default async function authRoutes(fastify) {
    fastify.post("/auth/login", async (request, reply) => {
        let { nickname } = request.body;

        try {
            nickname = validateNickname(nickname);
        } catch (e) {
            return reply.status(400).send({
                error: "INVALID_NICKNAME",
                message: e.message
            });
        }

        try {
            let player = await findPlayerByNickname(nickname);

            if (!player) {
                player = await createPlayer(nickname);
            }

            const token = jwtHelper.createToken(player);

            return reply.send({
                token,
                nickname: player.nickname
            });

        } catch (e) {
            console.error("AUTH_LOGIN_ERROR:", e);

            return reply.status(500).send({
                error: "AUTH_INTERNAL_ERROR",
                message: "Something went wrong"
            });
        }
    });
}