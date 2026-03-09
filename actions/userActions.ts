"use server"

import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getAllUsers = async () => {
    const data = await db.select().from(users)
    return data
}

export const getUser = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            todos: true,
        },
    })
    return user
}

