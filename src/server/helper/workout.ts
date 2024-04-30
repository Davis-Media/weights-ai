"use server";
import "server-only";
import { db } from "../db";
import { workout } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateProfile } from "./auth";

export const completeWorkout = async (workoutId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      error,
    };
  }

  await db
    .update(workout)
    .set({
      inProgress: false,
    })
    .where(eq(workout.id, workoutId));

  return {
    error: null,
  };
};

export const getInProgressWorkout = async () => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return undefined;
  }

  const curWorkout = await db.query.workout.findFirst({
    where: and(eq(workout.profileId, profile.id), eq(workout.inProgress, true)),
  });

  return curWorkout;
};

export const setWorkoutInProgress = async (workoutId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      error,
    };
  }

  await db
    .update(workout)
    .set({
      inProgress: false,
    })
    .where(eq(workout.profileId, profile.id));

  // TODO validate that the user owns this workout
  await db
    .update(workout)
    .set({
      inProgress: true,
    })
    .where(eq(workout.id, workoutId));

  return {
    error: null,
  };
};

export const createWorkout = async (data: {
  date: Date;
  location: string;
  name: string;
  inProgress: boolean;
}) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      nId: null,
      error,
    };
  }

  const insertedWorkout = await db.insert(workout).values({
    ...data,
    profileId: profile.id,
  }).returning({ insertedId: workout.id });

  if (data.inProgress) {
    await setWorkoutInProgress(insertedWorkout[0].insertedId);
  }

  return {
    nId: insertedWorkout[0].insertedId,
    error: null,
  };
};

export const getAllWorkouts = async () => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return [];
  }

  const workouts = await db.query.workout.findMany({
    where: eq(workout.profileId, profile.id),
    orderBy: desc(workout.date),
  });

  return workouts;
};

export const getWorkoutInfo = async (workoutId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return undefined;
  }

  const curWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, workoutId),
    with: {
      sets: {
        with: {
          userExercise: true,
        },
      },
    },
  });

  return curWorkout;
};
