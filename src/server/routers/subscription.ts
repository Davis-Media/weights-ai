import { env } from "@/env";
import { getBaseURL } from "../helper/url";
import { stripe } from "../stripe";
import { authProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

export const subscriptionRouter = createTRPCRouter({
  createCheckoutSession: authProcedure.mutation(async ({ ctx }) => {
    const baseUrl = getBaseURL();
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_creation: "always",
      metadata: {
        profileId: ctx.profile.id,
      },
      mode: "payment",
      success_url: `${baseUrl}/messages?start=true`,
      cancel_url: `${baseUrl}/messages?skip=true`,
    });

    return { url: session.url };
  }),
  createPortalSession: authProcedure.mutation(async ({ ctx }) => {
    const baseUrl = getBaseURL();
    if (!ctx.profile.stripeCustomerId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You do not have a stripe customer id",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.profile.stripeCustomerId,
      return_url: `${baseUrl}/profile`,
    });

    return { url: session.url };
  }),
});
