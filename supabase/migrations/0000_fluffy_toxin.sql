CREATE TABLE IF NOT EXISTS "set" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"lift" varchar(255) NOT NULL,
	"weight" integer NOT NULL,
	"reps" integer NOT NULL,
	"workout_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"location" varchar(500) NOT NULL,
	"name" varchar(255) NOT NULL,
	"in_progress" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set" ADD CONSTRAINT "set_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

alter table set enable row level security;

alter table workout enable row level security;
