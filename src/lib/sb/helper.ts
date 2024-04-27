"use server";
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("ERROR", error);
    return false;
  }

  // create the user profile
  return true;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: firstName + " " + lastName,
      },
    },
  });

  if (error) {
    console.log("ERROR", error);
    return false;
  }

  // create the user profile
  return true;
};

export const signInWithGithub = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "/auth/callback",
    },
  });

  if (error) {
    console.log("ERROR", error);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};
