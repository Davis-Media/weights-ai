"use server";
import "server-only";
import { db } from "../db";
import { workout } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { getOrCreateProfile } from "./auth";

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
