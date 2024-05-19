"use client";
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              <div className="flex flex-col justify-center space-y-4 col-span-1">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Weights AI
                  </h1>
                  <h5 className="text-sm text-neutral-500">By Big Stair</h5>
                  <p className="max-w-[600px] text-neutral-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Track your weights like you&apos;re having a conversation.
                  </p>
                  <p className="max-w-[600px] text-neutral-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    <span className="font-bold text-neutral-950">&quot;I just benched 225x5&quot;</span> is all it takes to track your progress.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="/auth/login"
                  >
                    Start Your Free Trial
                  </Link>
                </div>
              </div>
              <div className="col-span-1">
                <Image
                  alt="Image"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  height="310"
                  src="/home-hero.jpg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                AI-Powered Weight Tracking
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Tired of annoying spreadsheets? Just tell the app what you are
                doing and it will do the rest.
              </p>
              <div>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/FOrgMTZI7so?si=ZyyPL611dDCvDyDY"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                One-Time Purchase
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                Get full access to the app and all of its features{" "}
                <span className="font-bold">forever</span> with a one time
                purchase of $49.99.
              </p>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                This app is under active development and is still very much in beta. If you have any bugs, feature requests, or questions, please let me know. There are missing pieces, but I am working on it.
              </p>
              <div>
                <Link
                  href="/auth/login"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
