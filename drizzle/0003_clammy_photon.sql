ALTER TABLE "clinics" ADD COLUMN "phone" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "deactivated_at" timestamp;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "deactivated_at" timestamp;