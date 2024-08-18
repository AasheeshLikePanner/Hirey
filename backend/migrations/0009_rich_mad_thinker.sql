ALTER TABLE "chat" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "isFile" boolean DEFAULT false;