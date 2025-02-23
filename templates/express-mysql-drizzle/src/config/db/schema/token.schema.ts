import { relations } from "drizzle-orm";
import { userSchema } from "./user.schema.js";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { mysqlTable, text, timestamp, varchar, mysqlEnum } from "drizzle-orm/mysql-core";

// token type
export const tokenEnum = mysqlEnum("token_type", ["refresh_token", "otp"]);

// schema definition
export const tokenSchema = mysqlTable("token", {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    value: text("token").notNull(),
    type: tokenEnum.notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// define relationships
export const tokenRelations = relations(tokenSchema, ({ one }) => ({
    user: one(userSchema, { fields: [tokenSchema.userId], references: [userSchema.id] })
}));

// export the types
export type SelectableToken = InferSelectModel<typeof tokenSchema>;
export type InsertableToken = InferInsertModel<typeof tokenSchema>;
