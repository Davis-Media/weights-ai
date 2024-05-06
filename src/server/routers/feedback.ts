import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";

export const feedbackRouter = createTRPCRouter({
  submitFeedback: publicProcedure.input(z.object({
    feedback: z.string(),
    name: z.string(),
    email: z.string(),
    label: z.enum([
      "idea",
      "issue",
      "question",
      "complaint",
      "featureRequest",
      "other",
    ]),
  })).mutation(async ({ input }) => {
    const res = await fetch("https://projectplannerai.com/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: env.PROJECT_PLANNER_PROJECT_ID,
        title: input.label + ": " + new Date().toLocaleDateString(),
        ...input,
      }),
    });

    console.log(res);
    return { success: true };
  }),
});
