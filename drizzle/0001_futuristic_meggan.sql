ALTER TABLE "patients" RENAME COLUMN "full_name" TO "first_name";--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "last_name" varchar(255) NOT NULL;