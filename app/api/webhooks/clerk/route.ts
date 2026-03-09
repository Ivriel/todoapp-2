import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      const email = email_addresses?.[0]?.email_address || "";
      const firstName = first_name || "";
      const lastName = last_name || "";
      const name = `${firstName} ${lastName}`.trim() || 'User';
      
      const existingUser = await db.query.users.findFirst({
          where: eq(users.clerkId, id),
      });

      if (existingUser) {
          await db.update(users).set({
              name: name,
              email: email,
              firstName: firstName,
              lastName: lastName,
              photo: image_url,
              updatedAt: new Date(),
          }).where(eq(users.clerkId, id));
          return NextResponse.json({message:"user updated",existingUser});
      } else {
          // New user
          const newUser = {
            id: crypto.randomUUID(),
              clerkId: id,
              name: name,
              email: email,
              firstName: firstName,
              lastName: lastName,
              photo: image_url,
              createdAt: new Date(),
              updatedAt: new Date(),
          }
          const newUserResult = await db.insert(users).values(newUser).returning({clerkClientId:users.clerkId});
          return NextResponse.json({message:"new user created",newUserResult});
      }
  }

  if (eventType === 'user.deleted') {
      const { id } = evt.data;
      if (id) {
          await db.delete(users).where(eq(users.clerkId, id));
          return NextResponse.json({message:"user deleted",id});
      }
  }

  return new Response('', { status: 200 })
}