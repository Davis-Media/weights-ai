"use server";
import "server-only";
import { auth } from "@clerk/nextjs";
import { db } from ".";
import { set, workout } from "./schema";
import { generateId } from "../utils";
import { and, eq } from "drizzle-orm";

export const saveNewSets = async (
  input: {
    exercise: string;
    reps: number;
    weight: number;
  }[]
) => {
  const workout = await getInProgressWorkout();

  if (!workout) {
    return {
      error: "no selected workout :(",
    };
  }

  const createInput = input.map((inputSet) => {
    return {
      id: generateId(50),
      lift: inputSet.exercise,
      weight: inputSet.weight,
      reps: inputSet.reps,
      workoutId: workout.id,
    };
  });

  await db.insert(set).values(createInput);

  return { error: null };
};

export const getInProgressWorkout = async () => {
  const { userId } = auth();

  if (!userId) {
    return undefined;
  }

  const curWorkout = await db.query.workout.findFirst({
    where: and(eq(workout.userId, userId), eq(workout.inProgress, true)),
  });

  return curWorkout;
};

export const setWorkoutInProgress = async (workoutId: string) => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "user is not logged in",
    };
  }

  await db
    .update(workout)
    .set({
      inProgress: false,
    })
    .where(eq(workout.userId, userId));

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
  // ensure user is logged in
  const { userId } = auth();

  if (!userId) {
    return {
      nId: null,
      error: "user is not logged in",
    };
  }

  const id = generateId(100);

  await db.insert(workout).values({ ...data, userId, id });

  return {
    nId: id,
    error: null,
  };
};

export const getAllWorkouts = async () => {
  const { userId } = auth();

  if (!userId) {
    return [];
  }

  const workouts = await db.query.workout.findMany({
    where: eq(workout.userId, userId),
  });

  return workouts;
};

export const getAllExercises = async (workoutId: string) => {
  const { userId } = auth();

  if (!userId) {
    return [];
  }

  // TODO: ensure the user owns this workout

  const exercises = await db.query.set.findMany({
    where: eq(set.workoutId, workoutId),
  });

  return exercises;
};
