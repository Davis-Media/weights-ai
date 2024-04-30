"use server";
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { headers } from "next/headers";

export const signInWithGithub = async () => {
  const supabase = createClient();

  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log("ERROR", error);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};
