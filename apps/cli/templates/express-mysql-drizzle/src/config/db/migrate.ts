import { db } from "./db.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

export async function runMigrate() {
    console.log("⏳ Running migrations...");

    const start = Date.now();
    await migrate(db, { migrationsFolder: "drizzle" });
    const end = Date.now();

    console.log(`✅ Migrations completed in ${end - start}ms`);
    process.exit(0);
}

runMigrate().catch((err) => {
    console.error("❌ Migration failed with error message: ", err.message);
    process.exit(1);
});
