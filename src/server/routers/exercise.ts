import { and, eq, like } from "drizzle-orm";
import { db } from "../db";
import { profile, set, userExercise } from "../db/schema";
import { authProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { env } from "@/env";

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
      async ({ input, ctx }) => {
        const { query } = input;

        console.log(query);

        //asdf

        // search using the edge function
        const supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const res = await fetch(
          `${supabaseURL}/functions/v1/search-exercise`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              search: query,
              profile_id: ctx.profile.id,
            }),
          },
        );

        const data = (await res.json()) as {
          search: string;
          result: {
            name: string;
            id: string;
          }[];
        };

        return data.result;
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
