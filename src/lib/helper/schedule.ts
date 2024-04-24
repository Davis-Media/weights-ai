"use server";
import "server-only";
import { db } from "../db";
import { userSchedule, userScheduleEntry } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { getOrCreateProfile } from "./auth";

export const getUserScheduleOneDay = async (day: number) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }

  const entry = await db.query.userSchedule.findFirst({
    where: and(
      eq(userSchedule.profileId, profile.id),
      eq(userSchedule.day, day),
    ),
    with: {
      userScheduleEntries: {
        with: {
          userExercise: true,
        },
      },
    },
  });

  if (!entry) {
    return {
      message: "no schedule found",
      data: null,
    };
  }

  return {
    message: "success",
    data: entry,
  };
};

export const getUserScheduleDay = async (scheduleId: string) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      message: error,
      data: null,
    };
  }

  const entry = await db.query.userSchedule.findFirst({
    where: eq(userSchedule.id, scheduleId),
    columns: {
      day: true,
      id: true,
    },
    with: {
      userScheduleEntries: {
        with: {
          userExercise: true,
        },
      },
    },
  });

  if (!entry) {
    return {
      message: "no schedule found",
      data: null,
    };
  }

  return {
    message: "success",
    data: entry,
  };
};

export const getUserSchedule = async () => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
      data: [],
    };
  }

  const scheduleEntries = await db.query.userSchedule.findMany({
    where: eq(userSchedule.profileId, profile.id),
    columns: {
      day: true,
      id: true,
    },
    with: {
      userScheduleEntries: {
        columns: {
          id: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Successfully fetched schedule entries",
    data: scheduleEntries.map((se) => {
      return {
        day: se.day,
        id: se.id,
        exercises: se.userScheduleEntries.length,
      };
    }),
  };
};

export const updateUserSchedule = async (data: {
  scheduleId: string;
  exercises: {
    exerciseId: string;
    order: number;
  }[];
}) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
    };
  }

  // clear the schedule entries
  await db.delete(userScheduleEntry).where(
    eq(userScheduleEntry.userScheduleId, data.scheduleId),
  );

  // insert the exercises
  await db.insert(userScheduleEntry).values(data.exercises.map((ex) => {
    return {
      userScheduleId: data.scheduleId,
      userExerciseId: ex.exerciseId,
      order: ex.order,
    };
  }));

  return {
    success: true,
    message: "Schedule updated!",
  };
};

export const createUserSchedule = async (data: {
  day: number;
  exercises: {
    exerciseId: string;
    order: number;
  }[];
}) => {
  const { profile, error } = await getOrCreateProfile();

  if (error || !profile) {
    return {
      success: false,
      message: error,
    };
  }

  // ensure the user does not already have a schedule for that day
  const curDay = await db.query.userSchedule.findFirst({
    where: and(
      eq(userSchedule.profileId, profile.id),
      eq(userSchedule.day, data.day),
    ),
  });

  if (curDay) {
    return {
      success: false,
      message: "day already exists!",
    };
  }

  const insertedSchedule = await db.insert(userSchedule).values({
    profileId: profile.id,
    day: data.day,
  }).returning({ insertedId: userSchedule.id });

  // insert the exercises
  await db.insert(userScheduleEntry).values(data.exercises.map((ex) => {
    return {
      userScheduleId: insertedSchedule[0].insertedId,
      userExerciseId: ex.exerciseId,
      order: ex.order,
    };
  }));

  return {
    success: true,
    message: "Schedule created!",
  };
};
