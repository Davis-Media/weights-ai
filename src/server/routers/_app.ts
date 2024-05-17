import { z } from "zod";
import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { exerciseRouter } from "./exercise";
import { scheduleRouter } from "./schedule";
import { setsRouter } from "./sets";
import { workoutRouter } from "./workout";
import { userRouter } from "./user";
import { feedbackRouter } from "./feedback";
import { subscriptionRouter } from "./subscription";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../sb/database.types";
import { env } from "@/env";
import { openaiEmbeddingModel } from "../ai";
import { embed } from "ai";

export const appRouter = createTRPCRouter({
  workout: workoutRouter,
  sets: setsRouter,
  subscription: subscriptionRouter,
  exercise: exerciseRouter,
  schedule: scheduleRouter,
  user: userRouter,
  feedback: feedbackRouter,
  addEmbeddings: authProcedure.mutation(async () => {
    // FILL THESE IN WHEN U USE THIS
    const url = "";
    const service_role_key = "";

    // get the full user exercise table from DB
    const sbServerClient = createClient<Database>(
      url,
      service_role_key,
    );

    const { data } = await sbServerClient.from("user_exercise").select();

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const exercise = data[i];

        if (exercise.name_openai_embedding === null) {
          const { embedding } = await embed({
            model: openaiEmbeddingModel,
            value: exercise.name,
          });

          await sbServerClient.from("user_exercise").update({
            name_openai_embedding: JSON.stringify(embedding),
          }).eq("id", exercise.id);
        }
      }
    }

    return true;
  }),
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
