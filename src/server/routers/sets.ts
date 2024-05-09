import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { set } from "../db/schema";
import { TRPCError } from "@trpc/server";
import { getInProgressWorkout } from "../helper/workout";

export const setsRouter = createTRPCRouter({
  duplicateSet: authProcedure.input(z.object({ setId: z.string() })).mutation(
    async ({ ctx, input }) => {
      // ensure that the set belongs to the user
      const curSet = await db.query.set.findFirst({
        where: eq(set.id, input.setId),
        columns: {
          weight: true,
          reps: true,
          userExerciseId: true,
          workoutId: true,
        },
        with: {
          workout: {
            columns: {
              profileId: true,
            },
          },
        },
      });

      if (!curSet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Set not found",
        });
      }

      if (curSet.workout.profileId !== ctx.profile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this set",
        });
      }

      const duplicatedSet = await db.insert(set).values({
        weight: curSet.weight,
        reps: curSet.reps,
        userExerciseId: curSet.userExerciseId,
        workoutId: curSet.workoutId,
      }).returning({ insertedId: set.id });

      return { id: duplicatedSet[0].insertedId };
    },
  ),
  deleteSet: authProcedure.input(z.object({ setId: z.string() })).mutation(
    async ({ ctx, input }) => {
      // ensure that the set belongs to the user
      const curSet = await db.query.set.findFirst({
        where: eq(set.id, input.setId),
        columns: {},
        with: {
          workout: {
            columns: {
              profileId: true,
            },
          },
        },
      });

      if (!curSet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Set not found",
        });
      }

      if (curSet.workout.profileId !== ctx.profile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this set",
        });
      }

      await db.delete(set).where(eq(set.id, input.setId));

      return { success: true };
    },
  ),

  saveNewSets: authProcedure.input(
    z.object({
      sets: z.array(
        z.object({
          exerciseId: z.string(),
          reps: z.number(),
          weight: z.number(),
        }),
      ),
    }),
  ).mutation(async ({ input }) => {
    const workout = await getInProgressWorkout();

    if (!workout) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No workout selected",
      });
    }

    const createInput = input.sets.map((inputSet) => {
      return {
        userExerciseId: inputSet.exerciseId,
        weight: inputSet.weight,
        reps: inputSet.reps,
        workoutId: workout.id,
      };
    });

    await db.insert(set).values(createInput);

    return { success: true };
  }),
});
