import mysql from "mysql2/promise";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/mysql2";
import { getDbUrl } from "../../helpers/db.helper.js";

// create pool connection
export const pool = mysql.createPool(getDbUrl());

// create drizzle instance
export const db = drizzle(pool, {
    schema: schema,
    mode: "default"
});
