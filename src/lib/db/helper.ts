"use server";
import "server-only";
import { auth } from "@clerk/nextjs";
import { db } from ".";
import { set, workout } from "./schema";
import { generateId } from "../utils";
import { eq } from "drizzle-orm";

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
