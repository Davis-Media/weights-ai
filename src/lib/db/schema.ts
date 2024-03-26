import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workout = sqliteTable("workout", {
  id: text("id").primaryKey(),
  date: int("date", { mode: "timestamp" }).notNull(),
  location: text("location").notNull(),
  name: text("name").notNull(),
  inProgress: int("in_progress", { mode: "boolean" }).default(false).notNull(),
  // references clerk table
  userId: text("user_id").notNull(),
});

export const set = sqliteTable("set", {
  id: text("id").primaryKey(),
  lift: text("lift").notNull(),
  weight: int("weight").notNull(),
  reps: int("reps").notNull(),
  workoutId: text("workout_it")
    .references(() => workout.id)
    .notNull(),
});
