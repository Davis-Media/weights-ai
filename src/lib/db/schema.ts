import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const workout = pgTable("workout", {
  id: varchar("id", { length: 255 }).primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 500 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  inProgress: boolean("in_progress").default(false).notNull(),
  userId: text("user_id").notNull(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
  sets: many(set),
}));

export const set = pgTable("set", {
  id: varchar("id", { length: 255 }).primaryKey(),
  lift: varchar("lift", { length: 255 }).notNull(),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  workoutId: varchar("workout_id", { length: 255 })
    .references(() => workout.id)
    .notNull(),
});

export const setRelations = relations(set, ({ one }) => ({
  workout: one(workout, {
    fields: [set.workoutId],
    references: [workout.id],
  }),
}));
