import jwt from "jsonwebtoken";
import config from "../config.js";

class JwtHelper {

    constructor(secret) {
        this._secret = secret;
    }

    createToken(player) {
        return jwt.sign(
            {
                id: player.id,
                nickname: player.nickname
            },
            this._secret,
            {
                expiresIn: "7d"
            }
        );
    }

    verifyToken(token) {
        return jwt.verify(token, this._secret);
    }
}

const jwtHelper = new JwtHelper(config.secret);
export default jwtHelper;