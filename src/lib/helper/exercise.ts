"use server";
import "server-only";
import { db } from "../db";
import { and, eq, like } from "drizzle-orm";
import { getOrCreateProfile } from "./auth";
import { set, userExercise } from "../db/schema";

export const getAllUserExercises = async () => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return [];
  }

  const userExercises = await db.query.userExercise.findMany({
    where: eq(userExercise.profileId, profile.id),
  });

  return userExercises;
};

export const getAllExercises = async (workoutId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return [];
  }

  // TODO: ensure the user owns this workout

  const exercises = await db.query.set.findMany({
    where: eq(set.workoutId, workoutId),
  });

  return exercises;
};

export const getUserExercises = async () => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
      data: [],
    };
  }

  const userExercises = await db.select().from(userExercise).where(
    eq(userExercise.profileId, profile.id),
  );

  return {
    success: true,
    message: "fetched user exercises",
    data: userExercises,
  };
};

export const searchForExercise = async (query: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
      data: [],
    };
  }

  const exercises = await db.query.userExercise.findMany({
    where: and(
      like(userExercise.name, `%${query}%`),
      eq(userExercise.profileId, profile.id),
    ),
    columns: {
      name: true,
      id: true,
    },
  });

  return {
    success: true,
    message: "searched for exercises",
    data: exercises,
  };
};

export const createUserExercise = async (name: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
      data: "BAD NO USE IT FAILED",
    };
  }

  const res = await db.insert(userExercise).values({
    name,
    profileId: profile.id,
  }).returning({ insertedId: userExercise.id });

  return {
    success: true,
    message: "created user exercise",
    data: res[0].insertedId,
  };
};
