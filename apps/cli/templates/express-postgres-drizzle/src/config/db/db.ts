import pg from "pg";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDbUrl } from "../../helpers/db.helper.js";

// create pool connection
export const pool = new pg.Pool({ connectionString: getDbUrl() });

// create drizzle instance
export const db = drizzle(pool, { schema });
