"use server";
import "server-only";
import { db } from ".";
import { set, workout } from "./schema";
import { generateId } from "../utils";
import { and, eq } from "drizzle-orm";
import { createClient } from "../supabase/server";

export const deleteSet = async (setId: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  await db.delete(set).where(eq(set.id, setId));

  return "success";
};

export const saveNewSets = async (
  input: {
    exercise: string;
    reps: number;
    weight: number;
  }[],
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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return undefined;
  }

  const curWorkout = await db.query.workout.findFirst({
    where: and(eq(workout.userId, user.id), eq(workout.inProgress, true)),
  });

  return curWorkout;
};

export const setWorkoutInProgress = async (workoutId: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "user is not logged in",
    };
  }

  await db
    .update(workout)
    .set({
      inProgress: false,
    })
    .where(eq(workout.userId, user.id));

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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      nId: null,
      error: "user is not logged in",
    };
  }

  const id = generateId(100);

  await db.insert(workout).values({ ...data, userId: user.id, id });

  return {
    nId: id,
    error: null,
  };
};

export const getAllWorkouts = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const workouts = await db.query.workout.findMany({
    where: eq(workout.userId, user.id),
  });

  return workouts;
};

export const getWorkoutInfo = async (workoutId: string) => {
  const curWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, workoutId),
    with: {
      sets: true,
    },
  });

  return curWorkout;
};

export const getAllExercises = async (workoutId: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // TODO: ensure the user owns this workout

  const exercises = await db.query.set.findMany({
    where: eq(set.workoutId, workoutId),
  });

  return exercises;
};
