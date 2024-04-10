import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Check, CircleCheck, X } from "lucide-react";

export default function Page() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container flex flex-col items-center gap-4 px-4 md:px-6">
          <div className="text-center flex gap-6 flex-col">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Weights Tracker
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                The Log you can Talk to...
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The easiest way possible to track your lifts. Finish a great
                bench session? Just type{" "}
                <span className="font-bold">225x5x5</span> and your log knows
                what that means.
              </p>
            </div>
            <div className="grid max-w-sm gap-2 mx-auto">
              <Button size="lg">Get Started</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The all-in-one platform for seamless collaboration. Simplify
                your workflow, track progress, and ship faster with our
                intuitive project management tool.
              </p>
            </div>
          </div>
          <div className="grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 mx-auto items-start justify-center [&>img]:mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Task Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Easily create, assign, and track tasks to keep your team
                    organized.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Collaboration Tools</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share files, discuss ideas, and work together in real-time
                    with integrated collaboration tools.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Kanban Boards</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Visualize your workflow and manage tasks with customizable
                    Kanban boards.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Time Tracking</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track time spent on tasks and projects to improve
                    productivity and billable hours.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Custom Workflows</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create custom workflows to match your team process and
                    automate repetitive tasks.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CircleCheck className="h-6 w-6 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold">Insights & Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gain insights into your team performance with built-in
                    analytics and reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid max-w-3xl grid-cols-2 items-center justify-center gap-6 mx-auto sm:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              {/* <img
                alt="User"
                className="rounded-full aspect-square overflow-hidden object-cover object-center border-2 border-gray-100 border-gray-100 dark:border-gray-800 dark:border-gray-800"
                height="200"
                src="/placeholder.svg"
                width="200"
              /> */}
              <div className="space-y-2">
                <h3 className="font-semibold">Alice Johnson</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CEO, Acme Co
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <div className="text-xl">
                Our team loves the simplicity and power of the project
                management tool. It&apos;s been a game-changer for us, allowing
                everyone to stay organized and focused on delivering great
                results.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid max-w-3xl grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 px-4 mx-auto md:px-6 lg:max-w-5xl lg:gap-12 lg:px-0">
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple Pricing
              </h2>
              <p className="text-base text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Choose the plan that works best for your team. All plans include
                unlimited projects and tasks.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Sign Up for Free
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Free</CardTitle>
                <CardDescription>
                  For small teams just getting started.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Unlimited projects</span>
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Up to 5 users</span>
                  <X className="h-4 w-4" />
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  className="w-full inline-flex items-center justify-center rounded-b-md h-10 font-medium bg-gray-100 shadow-sm hover:bg-gray-100/90 dark:bg-gray-800 dark:hover:bg-gray-800/90"
                  href="#"
                >
                  Upgrade to Basic
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Basic</CardTitle>
                <CardDescription>
                  Perfect for teams ready to take their productivity to the next
                  level.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Unlimited projects</span>
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Up to 10 users</span>
                  <Check className="h-4 w-4" />
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  className="w-full inline-flex items-center justify-center rounded-b-md h-10 font-medium bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                  href="#"
                >
                  Upgrade to Premium
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Premium</CardTitle>
                <CardDescription>
                  Advanced features for teams that demand the best.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Unlimited projects</span>
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Unlimited users</span>
                  <Check className="h-4 w-4" />
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  className="w-full inline-flex items-center justify-center rounded-b-md h-10 font-medium bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                  href="#"
                >
                  Contact Sales
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
