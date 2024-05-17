import { and, eq, like, sql } from "drizzle-orm";
import { db } from "../db";
import { set, userExercise } from "../db/schema";
import { authProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { openaiEmbeddingModel } from "../ai";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { Database } from "../sb/database.types";

export const exerciseRouter = createTRPCRouter({
  getAllUserExercises: authProcedure.input(z.object({
    take: z.number().default(100),
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
    .mutation(
      async ({ input }) => {
        const { query } = input;

        const { embedding } = await embed({
          model: openaiEmbeddingModel,
          value: query,
        });

        const dbExercises = await db.select({
          name: userExercise.name,
          id: userExercise.id,
        }).from(userExercise).orderBy(
          sql`name_openai_embedding <=> ${
            JSON.stringify(
              embedding,
            )
          }`,
        ).limit(3);

        return dbExercises;
      },
    ),
  createUserExercise: authProcedure.input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;

      const { embedding } = await embed({
        model: openaiEmbeddingModel,
        value: name,
      });

      const sbServerClient = createClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
      );

      const res = await sbServerClient.from("user_exercise").insert({
        name,
        profile_id: ctx.profile.id,
        name_openai_embedding: JSON.stringify(embedding),
      }).select("id");

      if (res.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.error.message,
        });
      }

      return { id: res.data[0].id };
    }),
});
