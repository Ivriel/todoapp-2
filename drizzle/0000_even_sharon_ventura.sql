CREATE TABLE "todos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" text DEFAULT 'temp-user-id' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"clerkId" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"photo" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;