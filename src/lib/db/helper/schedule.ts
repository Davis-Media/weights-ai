"use server";
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { db } from "..";
import { userExercise, userSchedule, userScheduleEntry } from "../schema";
import { and, eq, like } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export const getUserExercises = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "not logged in!",
      data: [],
    };
  }

  const userExercises = await db.select().from(userExercise).where(
    eq(userExercise.userId, user.id),
  );

  return {
    success: true,
    message: "fetched user exercises",
    data: userExercises,
  };
};

export const searchForExercise = async (query: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "not logged in!",
      data: [],
    };
  }

  const exercises = await db.query.userExercise.findMany({
    where: and(
      like(userExercise.name, `%${query}%`),
      eq(userExercise.userId, user.id),
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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "not logged in!",
      data: "BAD NO USE IT FAILED",
    };
  }

  const id = generateId(100);

  await db.insert(userExercise).values({
    id,
    name,
    userId: user.id,
  });

  return {
    success: true,
    message: "created user exercise",
    data: id,
  };
};

export const getUserSchedule = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "not logged in!",
      data: [],
    };
  }

  const scheduleEntries = await db.query.userSchedule.findMany({
    where: eq(userSchedule.userId, user.id),
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

  console.log(scheduleEntries);

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

export const createUserSchedule = async (data: {
  day: number;
  exercises: {
    exerciseId: string;
    order: number;
  }[];
}) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "not logged in!",
    };
  }

  // ensure the user does not already have a schedule for that day
  const curDay = await db.query.userSchedule.findFirst({
    where: and(
      eq(userSchedule.userId, user.id),
      eq(userSchedule.day, data.day),
    ),
  });

  if (curDay) {
    return {
      success: false,
      message: "day already exists!",
    };
  }

  // insert the day
  const dayId = generateId(100);

  await db.insert(userSchedule).values({
    id: dayId,
    userId: user.id,
    day: data.day,
  });

  // insert the exercises
  await db.insert(userScheduleEntry).values(data.exercises.map((ex) => {
    return {
      userScheduleId: dayId,
      userExerciseId: ex.exerciseId,
      order: ex.order,
      id: generateId(100),
    };
  }));

  return {
    success: true,
    message: "Schedule created!",
  };
};
