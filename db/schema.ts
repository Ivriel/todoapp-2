
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    clerkId: text("clerkId").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    photo: text("photo"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const todos = pgTable("todos", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    done: boolean("done").default(false).notNull(),
    createdAt: timestamp("created_at").notNull(),
    userId: text("user_id").notNull().default("temp-user-id").references(() => users.id),
});

export const todosRelations = relations(todos, ({ one }) => ({
    user: one(users, {
        fields: [todos.userId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    todos: many(todos),
}));

export const schema = {
    users,
    todos,
    usersRelations,
    todosRelations
};
