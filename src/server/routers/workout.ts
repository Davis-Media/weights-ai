import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { set, workout } from "../db/schema";
import { authProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { trackProjectPlannerEvent } from "../helper/events";

export const workoutRouter = createTRPCRouter({
  getFullWorkoutDetails: authProcedure.input(
    z.object({ workoutId: z.string() }),
  ).query(async ({ ctx, input }) => {
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

    if (!curWorkout) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout not found",
      });
    }

    // collapse the sets into a nicer format
    const exercises: {
      name: string;
      keySetInfo: string; // ex. 225 x 5 x 5
      sets: {
        weight: number;
        reps: number;
      }[];
    }[] = [];

    for (let i = 0; i < curWorkout.sets.length; i++) {
      const set = curWorkout.sets[i];
      const userExercise = set.userExercise;

      const curExercise = exercises.findIndex((e) =>
        e.name === userExercise.name
      );

      if (curExercise === -1) {
        exercises.push({
          name: userExercise.name,
          keySetInfo: `${set.weight} x ${set.reps} x 1`,
          sets: [{
            weight: set.weight,
            reps: set.reps,
          }],
        });
      } else {
        exercises[curExercise].sets.push({
          weight: set.weight,
          reps: set.reps,
        });

        // update the keySetInfo
        let topWeight = 0;
        let topReps = 0;
        let topCount = 0;
        for (let j = 0; j < exercises[curExercise].sets.length; j++) {
          if (exercises[curExercise].sets[j].weight > topWeight) {
            topWeight = exercises[curExercise].sets[j].weight;
            topReps = exercises[curExercise].sets[j].reps;
            topCount = 1;
          } else if (exercises[curExercise].sets[j].weight === topWeight) {
            topCount++;
          }
        }

        exercises[curExercise].keySetInfo =
          `${topWeight} x ${topReps} x ${topCount}`;
      }
    }

    return {
      workoutName: curWorkout.name,
      date: curWorkout.date,
      location: curWorkout.location,
      exercises,
    };
  }),
  deleteWorkout: authProcedure.input(z.object({ workoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const curWorkout = await db.query.workout.findFirst({
        where: and(
          eq(workout.id, input.workoutId),
          eq(workout.profileId, ctx.profile.id),
        ),
      });
      if (!curWorkout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workout not found",
        });
      }
      // delete the set
      await db.delete(set).where(
        and(
          eq(set.workoutId, input.workoutId),
        ),
      );
      await db
        .delete(workout)
        .where(
          and(
            eq(workout.id, input.workoutId),
            eq(workout.profileId, ctx.profile.id),
          ),
        );

      return { success: true };
    }),
  getCurrentWorkout: authProcedure.query(async ({ ctx }) => {
    const curWorkout = await db.query.workout.findFirst({
      where: and(
        eq(workout.profileId, ctx.profile.id),
        eq(workout.inProgress, true),
      ),
    });

    return curWorkout || null;
  }),
  completeWorkout: authProcedure.input(z.object({ workoutId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(workout)
        .set({
          inProgress: false,
        })
        .where(eq(workout.id, input.workoutId));

      await trackProjectPlannerEvent("completed_workout");

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

    await trackProjectPlannerEvent("created_workout");

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
