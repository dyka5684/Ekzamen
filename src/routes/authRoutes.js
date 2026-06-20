import {createPlayer, findPlayerByNickname} from "../db/repositories/playerRepository.js";
import jwtHelper from "../helpers/jwt.js";
import {isInvalidNickname} from "../validators/auth.js";

export default async function authRoutes(fastify) {
    fastify.post("/auth/login", async (request, reply) => {
        const { nickname } = request.body;

        if (isInvalidNickname(nickname)) {
            return reply.status(400).send({
                message: "Nickname required"
            });
        }

        let player = await findPlayerByNickname(nickname);

        if (!player) {
            player = await createPlayer(nickname);
        }

        const token = jwtHelper.createToken(player);

        return reply.send({
            token,
            nickname: player.nickname
        });
    });
}