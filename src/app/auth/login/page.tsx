"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signInWithGithub } from "@/lib/sb/helper";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="mx-auto max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in with your GitHub account.
            <span className="italic"> more coming soon</span>
          </p>
        </div>
        <div className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              signInWithGithub();
            }}
          >
            Sign in with GitHub
          </Button>
        </div>
      </Card>
    </div>
  );
}
