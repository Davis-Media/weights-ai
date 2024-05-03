import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { workout } from "../db/schema";
import { authProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const workoutRouter = createTRPCRouter({
  getCurrentWorkout: authProcedure.query(async ({ ctx }) => {
    const curWorkout = await db.query.workout.findFirst({
      where: and(
        eq(workout.profileId, ctx.profile.id),
        eq(workout.inProgress, true),
      ),
    });

    return curWorkout;
  }),
  completeWorkout: authProcedure.input(z.object({ workoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(workout)
        .set({
          inProgress: false,
        })
        .where(eq(workout.id, input.workoutId));

      return { success: true };
    }),
  setWorkoutInProgress: authProcedure.input(z.object({ workoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(workout)
        .set({
          inProgress: false,
        })
        .where(eq(workout.profileId, ctx.profile.id));

      await db
        .update(workout)
        .set({
          inProgress: true,
        })
        .where(
          and(
            eq(workout.id, input.workoutId),
            eq(workout.profileId, ctx.profile.id),
          ),
        );

      return { success: true };
    }),
  createWorkout: authProcedure.input(
    z.object({
      date: z.date(),
      location: z.string(),
      name: z.string(),
      inProgress: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const insertedWorkout = await db.insert(workout).values({
      ...input,
      profileId: ctx.profile.id,
    }).returning({ insertedId: workout.id });

    if (input.inProgress) {
      await db
        .update(workout)
        .set({
          inProgress: false,
        })
        .where(eq(workout.profileId, ctx.profile.id));

      await db
        .update(workout)
        .set({
          inProgress: true,
        })
        .where(
          and(
            eq(workout.id, insertedWorkout[0].insertedId),
            eq(workout.profileId, ctx.profile.id),
          ),
        );
    }

    return {
      nId: insertedWorkout[0].insertedId,
    };
  }),
  getAllWorkouts: authProcedure.query(async ({ ctx }) => {
    const workouts = await db.query.workout.findMany({
      where: eq(workout.profileId, ctx.profile.id),
      orderBy: desc(workout.date),
    });

    return workouts;
  }),
  getWorkoutInfo: authProcedure.input(z.object({ workoutId: z.string() }))
    .query(async ({ ctx, input }) => {
      const curWorkout = await db.query.workout.findFirst({
        where: and(
          eq(workout.id, input.workoutId),
          eq(workout.profileId, ctx.profile.id),
        ),
        with: {
          sets: {
            with: {
              userExercise: true,
            },
          },
        },
      });

      return curWorkout;
    }),
});
