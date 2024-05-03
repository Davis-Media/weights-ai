ALTER TABLE "profile" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "pro_payment_id" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "free_trial_ends_at" timestamp with time zone NOT NULL DEFAULT '1970-01-01 00:00:00'::timestamptz;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "user_exercise" ("name");