import { relations } from "drizzle-orm";
import { userSchema } from "./user.schema.js";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

// token type
export const tokenEnum = pgEnum("token_type", ["refresh_token", "otp"]);

// schema definition
export const tokenSchema = pgTable(
    "token",

    {
        id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
        userId: uuid("user_id").notNull(),
        value: text("token").notNull(),
        type: tokenEnum("type").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull()
    }
);

// define relationships
export const tokenRelations = relations(tokenSchema, ({ one }) => ({
    user: one(userSchema, { fields: [tokenSchema.userId], references: [userSchema.id] })
}));

// export the types
export type SelectableToken = InferSelectModel<typeof tokenSchema>;
export type InsertableToken = InferInsertModel<typeof tokenSchema>;
