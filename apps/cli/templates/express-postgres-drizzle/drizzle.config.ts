import { defineConfig } from "drizzle-kit";

const connectionString =
    process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/node_api_dev_db";

export default defineConfig({
    dialect: "postgresql",
    schema: "./dist/src/config/db/schema/*",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: connectionString
    },
    migrations: {
        prefix: "timestamp",
        table: "drizzle_migrations",
        schema: "public"
    }
});