import { eq } from "drizzle-orm";
import { db } from "../db";
import { set } from "../db/schema";
import { getOrCreateProfile } from "./auth";
import { getInProgressWorkout } from "./workout";

export const deleteSet = async (setId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return null;
  }

  await db.delete(set).where(eq(set.id, setId));

  return "success";
};

export const saveNewSets = async (
  input: {
    exerciseId: string;
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
      userExerciseId: inputSet.exerciseId,
      weight: inputSet.weight,
      reps: inputSet.reps,
      workoutId: workout.id,
    };
  });

  await db.insert(set).values(createInput);

  return { error: null };
};
