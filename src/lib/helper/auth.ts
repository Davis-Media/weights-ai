"use server";
import "server-only";
import { createClient } from "@/lib/sb/server";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { profile } from "../db/schema";

export const getOrCreateProfile = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      error: "user is not logged in",
    };
  }

  const curProfile = await db.query.profile.findFirst({
    where: eq(profile.id, user.id),
  });

  if (curProfile) {
    return {
      error: null,
      profile: curProfile,
    };
  }

  // create the profile
  const email = user.email;
  if (!email) {
    return {
      error: "no email found, please contact support",
      profile: null,
    };
  }

  const fullNameMetadata = user.user_metadata.full_name ?? "";

  const nameParts = fullNameMetadata.split(" ") as string[];
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts[1] ?? "";

  await db.insert(profile).values({
    id: user.id,
    email,
    firstName,
    lastName,
  });

  const curProfile2 = await db.query.profile.findFirst({
    where: eq(profile.id, user.id),
  });

  if (!curProfile2) {
    return {
      error: "profile not created",
      profile: null,
    };
  }

  return {
    error: null,
    profile: curProfile2,
  };
};
