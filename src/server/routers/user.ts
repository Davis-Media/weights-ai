import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure.query(({ ctx }) => {
    return ctx.profile;
  }),
});
