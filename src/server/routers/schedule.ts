import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { userSchedule, userScheduleEntry } from "../db/schema";

export const scheduleRouter = createTRPCRouter({
  getUserScheduleOneDay: authProcedure.input(z.object({
    day: z.number(),
  })).query(async ({ ctx, input }) => {
    const entry = await db.query.userSchedule.findFirst({
      where: and(
        eq(userSchedule.profileId, ctx.profile.id),
        eq(userSchedule.day, input.day),
      ),
      with: {
        userScheduleEntries: {
          with: {
            userExercise: true,
          },
        },
      },
    });
    return entry;
  }),
  getUserScheduleDay: authProcedure.input(z.object({ scheduleId: z.string() }))
    .query(async ({ input }) => {
      const entry = await db.query.userSchedule.findFirst({
        where: eq(userSchedule.id, input.scheduleId),
        columns: {
          day: true,
          id: true,
          name: true,
        },
        with: {
          userScheduleEntries: {
            with: {
              userExercise: true,
            },
          },
        },
      });

      return entry;
    }),
  getUserSchedule: authProcedure.query(async ({ ctx }) => {
    const scheduleEntries = await db.query.userSchedule.findMany({
      where: eq(userSchedule.profileId, ctx.profile.id),
      columns: {
        day: true,
        id: true,
        name: true,
      },
      with: {
        userScheduleEntries: {
          columns: {
            id: true,
          },
        },
      },
    });

    return scheduleEntries.map((se) => {
      return {
        day: se.day,
        id: se.id,
        name: se.name,
        exercises: se.userScheduleEntries.length,
      };
    });
  }),
  updateUserSchedule: authProcedure.input(
    z.object({
      scheduleId: z.string(),
      name: z.string(),
      exercises: z.array(
        z.object({
          exerciseId: z.string(),
          order: z.number(),
        }),
      ),
    }),
  ).mutation(async ({ input, ctx }) => {
    // clear the schedule entries
    await db.delete(userScheduleEntry).where(
      eq(userScheduleEntry.userScheduleId, input.scheduleId),
    );

    // insert the exercises
    await db.insert(userScheduleEntry).values(input.exercises.map((ex) => {
      return {
        userScheduleId: input.scheduleId,
        userExerciseId: ex.exerciseId,
        order: ex.order,
      };
    }));

    // update the schedule name
    await db.update(userSchedule).set({ name: input.name }).where(
      eq(userSchedule.id, input.scheduleId),
    );

    return { success: true };
  }),
  createUserSchedule: authProcedure.input(
    z.object({
      name: z.string(),
      day: z.number(),
      exercises: z.array(
        z.object({
          exerciseId: z.string(),
          order: z.number(),
        }),
      ),
    }),
  ).mutation(async ({ input, ctx }) => {
    // ensure the user does not already have a schedule for that day
    const curDay = await db.query.userSchedule.findFirst({
      where: and(
        eq(userSchedule.profileId, ctx.profile.id),
        eq(userSchedule.day, input.day),
      ),
    });

    if (curDay) {
      return {
        success: false,
        message: "day already exists!",
      };
    }

    const insertedSchedule = await db.insert(userSchedule).values({
      profileId: ctx.profile.id,
      day: input.day,
      name: input.name,
    }).returning({ insertedId: userSchedule.id });

    // insert the exercises
    await db.insert(userScheduleEntry).values(input.exercises.map((ex) => {
      return {
        userScheduleId: insertedSchedule[0].insertedId,
        userExerciseId: ex.exerciseId,
        order: ex.order,
      };
    }));

    return { success: true };
  }),
});
