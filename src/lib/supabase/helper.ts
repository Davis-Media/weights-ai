"use server";
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export const signInWithGithub = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log("ERROR", error);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};
