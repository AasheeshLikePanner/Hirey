ALTER TABLE "chat" ADD COLUMN "file" text;--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN IF EXISTS "image";--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN IF EXISTS "video";