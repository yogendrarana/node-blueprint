import { tokenSchema } from "./token.schema.js";
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// role
export const roleEnum = pgEnum("role", ["user", "admin"]);

// schema definition
export const userSchema = pgTable(
    "user",

    {
        id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
        name: varchar("name", { length: 50 }),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: text("password"),
        role: roleEnum("role").notNull().default("user"),
        googleId: varchar("googleId", { length: 255 }),

        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow()
    }
);

// relations
export const userRelations = relations(userSchema, ({ many }) => ({
    tokens: many(tokenSchema)
}));

// type
export type SelectableUser = InferSelectModel<typeof userSchema>;
export type InsertableUser = InferInsertModel<typeof userSchema>;
