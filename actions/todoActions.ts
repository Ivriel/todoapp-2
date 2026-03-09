"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
export const getData = async (userId: string) => {
    const data = await db.select().from(todos).where(eq(todos.userId, userId));
    return data;
};

export const addTodo = async (id: string, title: string, userId: string) => {
    await db.insert(todos).values({
        id: id,
        title: title,
        createdAt: new Date(),
        done: false,
        userId: userId,
    });
};

export const deleteTodo = async (id: string) => {
    await db.delete(todos).where(eq(todos.id, id));

    revalidatePath("/");
};

export const toggleTodo = async (id: string) => {
    await db
        .update(todos)
        .set({
            done: not(todos.done),
        })
        .where(eq(todos.id, id));

    revalidatePath("/");
};

export const editTodo = async (id: string, title: string) => {
    await db
        .update(todos)
        .set({
            title: title,
        })
        .where(eq(todos.id, id));

    revalidatePath("/");
};
