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
    })
    return user
}

export const getUserByClerkId = async (clerkId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    })
    return user
}

export const createFallbackUser = async (clerkId: string, name: string, email: string) => {
    const newUserId = crypto.randomUUID()
    const [newUser] = await db.insert(users).values({
        id: newUserId,
        clerkId: clerkId,
        name: name,
        email: email,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ")[1] || "",
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning()
    return newUser
}
