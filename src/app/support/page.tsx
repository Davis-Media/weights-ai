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
import { Textarea } from "@/components/ui/textarea";
import {
  SelectItem,
  SelectContent,
  Select,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function SupportPage() {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState<
    "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
  >("idea");

  const feedbackMutation = api.feedback.submitFeedback.useMutation({
    onSuccess: () => {
      alert("Thank you for your feedback!");
      setFeedback("");
      setName("");
      setEmail("");
    },
  });

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Have a question, idea, or need assistance? Send us an email and we
            will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">info@acme.com</div>
            <p className="text-gray-500 dark:text-gray-400">
              We would love to work with you!
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            This is brand new tech, if you have any bugs, feature requests,
            ideas, or questions, please let us know.{" "}
            <span className="font-bold">We would love to hear from you!</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="label">Label</Label>
                <Select value={label} onValueChange={(e) => setLabel(e as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="featureRequest">
                      Feature Request
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full"
              type="button"
              disabled={feedbackMutation.isPending}
              onClick={() => {
                feedbackMutation.mutate({
                  feedback,
                  name,
                  email,
                  label,
                });
              }}
            >
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
