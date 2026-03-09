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

export const syncUser = async (userId: string, name: string, email: string) => {
    // Cek apakah user sudah ada di database lokal kita
    const newUserId = crypto.randomUUID()
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })

    // Jika belum ada, simpan data dari Clerk ke database lokal
    if (!existingUser) {
        await db.insert(users).values({
            id: newUserId,
            name: name,
            email: email,
            clerkId: userId,
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}