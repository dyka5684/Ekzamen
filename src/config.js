import "dotenv/config";

const config = {
    port: Number(process.env.PORT),
    host: String(process.env.HOST),
    db_url: String(process.env.DATABASE_URL),
    secret: String(process.env.JWT_SECRET),
}

export default config;