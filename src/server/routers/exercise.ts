import { and, eq, like } from "drizzle-orm";
import { db } from "../db";
import { profile, set, userExercise } from "../db/schema";
import { authProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const exerciseRouter = createTRPCRouter({
  getAllUserExercises: authProcedure.input(z.object({
    take: z.number().default(10),
    skip: z.number().default(0),
  })).query(async ({ ctx, input }) => {
    const userExercises = await db.query.userExercise.findMany({
      where: eq(userExercise.profileId, ctx.profile.id),
      limit: input.take,
      offset: input.skip,
    });

    return userExercises;
  }),
  getAllSets: authProcedure.input(z.object({
    workoutId: z.string(),
  })).query(async ({ input }) => {
    const { workoutId } = input;

    const exercises = await db.query.set.findMany({
      where: eq(set.workoutId, workoutId),
    });

    return exercises;
  }),
  searchForExercise: authProcedure.input(z.object({ query: z.string() }))
    .query(
      async ({ input }) => {
        const { query } = input;

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

        return exercises;
      },
    ),

  createUserExercise: authProcedure.input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;

      const res = await db.insert(userExercise).values({
        name,
        profileId: ctx.profile.id,
      }).returning({ insertedId: userExercise.id });

      return { id: res[0].insertedId };
    }),
});
