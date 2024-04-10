CREATE TABLE IF NOT EXISTS "set" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"weight" integer NOT NULL,
	"reps" integer NOT NULL,
	"user_exercise_id" varchar(100) NOT NULL,
	"workout_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_exercise" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_schedule" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"day" integer NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_schedule_entry" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"user_exercise_id" varchar(100) NOT NULL,
	"user_schedule_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"location" varchar(500) NOT NULL,
	"name" varchar(255) NOT NULL,
	"in_progress" boolean DEFAULT false NOT NULL,
	"ended_at" timestamp with time zone,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set" ADD CONSTRAINT "set_user_exercise_id_user_exercise_id_fk" FOREIGN KEY ("user_exercise_id") REFERENCES "user_exercise"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set" ADD CONSTRAINT "set_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_schedule_entry" ADD CONSTRAINT "user_schedule_entry_user_exercise_id_user_exercise_id_fk" FOREIGN KEY ("user_exercise_id") REFERENCES "user_exercise"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_schedule_entry" ADD CONSTRAINT "user_schedule_entry_user_schedule_id_user_schedule_id_fk" FOREIGN KEY ("user_schedule_id") REFERENCES "user_schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

alter table set enable row level security;
alter table workout enable row level security;
alter table user_schedule_entry enable row level security;
alter table user_exercise enable row level security;
alter table user_schedule enable row level security;

