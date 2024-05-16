"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function ProfilePage() {
  const profileQuery = api.user.getUserProfile.useQuery();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const utils = api.useUtils();

  const emailMutation = api.user.updateUserEmail.useMutation({
    onSuccess: () => {
      alert("Updated!");
      utils.user.getUserProfile.invalidate();
    },
  });
  const nameMutation = api.user.updateUserName.useMutation({
    onSuccess: () => {
      alert("Updated!");
      utils.user.getUserProfile.invalidate();
    },
  });

  const router = useRouter();

  const subscribeMutation = api.subscription.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        router.replace(url);
      }
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setEmail(profileQuery.data.email);
      setFirstName(profileQuery.data.firstName);
      setLastName(profileQuery.data.lastName);
    }
  }, [profileQuery.data]);

  if (profileQuery.isLoading) return <div>Loading...</div>;

  if (!profileQuery.data) return <div>Please login...</div>;

  return (
    <div className="grid gap-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Manage your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={() => emailMutation.mutate(email)}
            disabled={emailMutation.isPending}
          >
            Update
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>Update your first and last name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => nameMutation.mutate({ firstName, lastName })}
            disabled={nameMutation.isPending}
          >
            Update
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {profileQuery.data.role === "pro" && (
            <p>
              You are already subscribed! If you have any questions, issues, or
              need help, please contact us.
            </p>
          )}
          {profileQuery.data.role === "user" && (
            <div>
              <p>
                Your free trial ends on{" "}
                {profileQuery.data.freeTrialEndsAt.toLocaleDateString()}
              </p>
              <Button onClick={() => subscribeMutation.mutate()}>
                Buy Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
