import { z } from "zod";
import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../db";
import { profile } from "../db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure.query(({ ctx }) => {
    return ctx.profile;
  }),
  updateUserName: authProcedure.input(
    z.object({ firstName: z.string(), lastName: z.string() }),
  ).mutation(async ({ ctx, input }) => {
    await db.update(profile).set({
      firstName: input.firstName,
      lastName: input.lastName,
    }).where(eq(profile.id, ctx.profile.id));

    return { success: true };
  }),
  updateUserEmail: authProcedure.input(z.string()).mutation(
    async ({ ctx, input }) => {
      await db.update(profile).set({ email: input }).where(
        eq(profile.id, ctx.profile.id),
      );

      return { success: true };
    },
  ),
});
