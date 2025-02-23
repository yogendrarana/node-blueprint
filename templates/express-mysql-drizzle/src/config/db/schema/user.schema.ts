// user.schema.ts
import { tokenSchema } from "./token.schema.js";
import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// role
export const roleEnum = mysqlEnum("role", ["user", "admin"]);

// schema definition
export const userSchema = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 50 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    role: roleEnum.notNull().default("user"),
    googleId: varchar("googleId", { length: 255 }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// relations
export const userRelations = relations(userSchema, ({ many }) => ({
    tokens: many(tokenSchema)
}));

// type
export type SelectableUser = InferSelectModel<typeof userSchema>;
export type InsertableUser = InferInsertModel<typeof userSchema>;
