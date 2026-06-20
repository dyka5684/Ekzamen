import "dotenv/config";

const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
    db_url: process.env.DATABASE_URL,
    secret: process.env.JWT_SECRET,
}

export default config;