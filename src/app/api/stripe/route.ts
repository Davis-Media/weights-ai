import { db } from "@/server/db";
import { profile } from "@/server/db/schema";
import { trackProjectPlannerEvent } from "@/server/helper/events";
import { stripe } from "@/server/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { Stripe } from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    if (!signature) {
      return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new NextResponse("Missing Stripe webhook secret", { status: 500 });
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const sessionWithCustomer = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["customer"],
        },
      );

      if (sessionWithCustomer.metadata) {
        const profileId = sessionWithCustomer.metadata.profileId as string;

        const customer = sessionWithCustomer.customer as Stripe.Customer | null;
        if (customer) {
          // add customer to user
          await db
            .update(profile)
            .set({
              stripeCustomerId: customer.id,
              proPaymentId: sessionWithCustomer.id,
              role: "pro",
            })
            .where(eq(profile.id, profileId));

          await trackProjectPlannerEvent("pro_user_created");
        }
      }
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Handle successful payment intent
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
