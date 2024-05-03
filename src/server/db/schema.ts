import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "pro", "admin"]);

export const profile = pgTable("profile", {
  // MATCHES USER ID FROM SUPABASE AUTH
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  role: roleEnum("role").notNull().default("user"),
  stripeCustomerId: text("stripe_customer_id"),
  proPaymentId: text("pro_payment_id"),
  freeTrialEndsAt: timestamp("free_trial_ends_at", { withTimezone: true })
    .notNull().$defaultFn(() => {
      const currentDate = new Date();
      const futureDate = new Date(
        currentDate.getTime() + (7 * 24 * 60 * 60 * 1000),
      );
      return futureDate;
    }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
    .$defaultFn(() => new Date()),
});

export const profileRelations = relations(profile, ({ many }) => ({
  userExercises: many(userExercise),
  userSchedules: many(userSchedule),
  workouts: many(workout),
}));

export const userExercise = pgTable("user_exercise", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  profileId: uuid("profile_id").notNull().references(() => profile.id),
}, (table) => {
  return {
    nameIdx: index("name_idx").on(table.name),
  };
});

export const userExerciseRelations = relations(
  userExercise,
  ({ many, one }) => {
    return {
      userScheduleEntries: many(userScheduleEntry),
      sets: many(set),
      profile: one(profile, {
        fields: [userExercise.profileId],
        references: [profile.id],
      }),
    };
  },
);

export const userSchedule = pgTable("user_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  // NOTE: sunday = 0
  day: integer("day").notNull(),
  name: text("name").notNull().default("Big Lift"),
  profileId: uuid("profile_id").notNull().references(() => profile.id),
});

export const userScheduleRelations = relations(
  userSchedule,
  ({ many, one }) => {
    return {
      userScheduleEntries: many(userScheduleEntry),
      profile: one(profile, {
        fields: [userSchedule.profileId],
        references: [profile.id],
      }),
    };
  },
);

export const userScheduleEntry = pgTable("user_schedule_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  order: integer("order").notNull(),
  userExerciseId: uuid("user_exercise_id").notNull()
    .references(() => userExercise.id),
  userScheduleId: uuid("user_schedule_id").notNull()
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
      fields: [userScheduleEntry.userScheduleId],
      references: [userSchedule.id],
    }),
  }),
);

export const workout = pgTable("workout", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  location: text("location").notNull(),
  name: text("name").notNull(),
  inProgress: boolean("in_progress").default(false).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  profileId: uuid("profile_id").notNull().references(() => profile.id),
});

export const workoutRelations = relations(workout, ({ many, one }) => ({
  sets: many(set),
  profile: one(profile, {
    fields: [workout.profileId],
    references: [profile.id],
  }),
}));

export const set = pgTable("set", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
    .$defaultFn(() => new Date()),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  userExerciseId: uuid("user_exercise_id").notNull()
    .references(() => userExercise.id),
  workoutId: uuid("workout_id")
    .references(() => workout.id)
    .notNull(),
});

export const setRelations = relations(set, ({ one }) => ({
  userExercise: one(userExercise, {
    fields: [set.userExerciseId],
    references: [userExercise.id],
  }),
  workout: one(workout, {
    fields: [set.workoutId],
    references: [workout.id],
  }),
}));
