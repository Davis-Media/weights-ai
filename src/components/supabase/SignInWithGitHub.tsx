"use client";

import { signInWithGithub } from "@/lib/supabase/helper";
import { Button } from "../ui/button";

export function SignInWithGitHub() {
  return (
    <Button
      onClick={async () => {
        await signInWithGithub();
      }}
    >
      Sign in with GitHub
    </Button>
  );
}
