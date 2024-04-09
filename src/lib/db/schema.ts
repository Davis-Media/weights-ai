import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userExercise = pgTable("user_exercise", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: varchar("user_id").notNull(),
});

export const userExerciseRelations = relations(userExercise, ({ many }) => {
  return {
    userScheduleEntries: many(userScheduleEntry),
    sets: many(set),
  };
});

export const userSchedule = pgTable("user_schedule", {
  id: varchar("id", { length: 100 }).primaryKey(),
  day: varchar("day", {
    length: 20,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  }).notNull(),
  userId: varchar("user_id").notNull(),
});

export const userScheduleRelations = relations(userSchedule, ({ many }) => {
  return {
    userScheduleEntries: many(userScheduleEntry),
  };
});

export const userScheduleEntry = pgTable("user_schedule_entry", {
  id: varchar("id", { length: 100 }).primaryKey(),
  order: integer("order").notNull(),
  userExerciseId: varchar("user_exercise_id", { length: 100 }).notNull()
    .references(() => userExercise.id),
  userScheduleId: varchar("user_schedule_id", { length: 100 }).notNull()
    .references(() => userSchedule.id),
});

export const userScheduleEntryRelations = relations(
  userScheduleEntry,
  ({ one }) => ({
    userExercise: one(userExercise, {
      fields: [userScheduleEntry.userExerciseId],
      references: [userExercise.id],
    }),
    userSchedule: one(userSchedule, {
      fields: [userScheduleEntry.userExerciseId],
      references: [userSchedule.id],
    }),
  }),
);

export const workout = pgTable("workout", {
  id: varchar("id", { length: 255 }).primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 500 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  inProgress: boolean("in_progress").default(false).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  userId: varchar("user_id").notNull(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
  sets: many(set),
}));

export const set = pgTable("set", {
  id: varchar("id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  userExerciseId: varchar("user_exercise_id", { length: 100 }).notNull()
    .references(() => userExercise.id),
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
