"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signInWithGithub } from "@/server/sb/helper";

export default function Component() {
  return (
    <div className="flex flex-col w-full h-screen  md:flex-row">
      <div className="grow flex flex-col gap-1 justify-center px-12 prose lg:prose-xl">
        <h3>Welcome to Weights AI</h3>
        <p>
          Weights AI is a simple, open source weights tracker, powered by
          Generative UI.
        </p>
        <p>Our pricing model is incredibly simple.</p>
        <div>
          <h4>
            1. Free Trial: When you sign up you get a free trial for 7 days with
            all features unlocked.
          </h4>
          <h4>
            2. One time pro purchase: There is no subscription model, if you
            want to unlock all features you simply pay $49.99 <span>ONCE</span>{" "}
            and you will own it forever.
          </h4>
        </div>
        <p>
          No subscriptions, no hidden features, no ads, no bullshit. Just a
          bleeding edge open source weights tracker to maximize your gains.
        </p>

        <p>
          Check out the repo for a roadmap, self hosting instructions, and more.
        </p>
      </div>
      <div className="md:w-1/2 bg-neutral-300 flex items-center justify-center">
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
    </div>
  );
}
