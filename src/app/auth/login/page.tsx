"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signInWithEmail, signInWithGithub } from "@/lib/sb/helper";
import { useState } from "react";
import Link from "next/link";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="mx-auto max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in with your email or GitHub account.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signInWithEmail(email, password)}
          >
            Sign In
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              signInWithGithub();
            }}
          >
            Sign in with GitHub
          </Button>
          <div>
            <Link
              href="/auth/signup"
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
