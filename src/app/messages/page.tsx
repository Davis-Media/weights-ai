import { MessagesPage } from "@/components/client-pages/messages";
import { env } from "@/env";
import { getBaseURL } from "@/server/helper/url";
import { stripe } from "@/server/stripe";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    start?: string;
    skip?: string;
  };
}) {
  const profile = await api.user.getUserProfile();

  if (!profile) {
    return <div>No profile found...</div>;
  }

  let isFreeTrial = false;
  let isNewPro = !!searchParams?.start;

  // check if the user is subscribed
  if (profile.role === "user") {
    if (!searchParams?.skip) {
      const baseUrl = getBaseURL();
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
        customer_creation: "always",
        metadata: {
          profileId: profile.id,
        },
        mode: "payment",
        success_url: `${baseUrl}/messages?start=true`,
        cancel_url: `${baseUrl}/messages?skip=true`,
      });

      if (session.url) {
        redirect(session.url);
      }
    } else {
      // check if the free trial is over
      const now = new Date();
      const freeTrialEndsAt = profile.freeTrialEndsAt;
      if (now > freeTrialEndsAt) {
        // if the free trial is over, redirect to the pro page
        redirect(`/expired`);
      } else {
        isFreeTrial = true;
      }
    }
  }

  return (
    <>
      <MessagesPage
        isFreeTrial={isFreeTrial}
        isNewPro={isNewPro}
        freeTrialEndsAt={profile.freeTrialEndsAt}
      />
    </>
  );
}
