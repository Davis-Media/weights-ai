"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SystemMessage, UserMessage } from "@/components/Messages";
import { CurrentWorkout } from "@/components/workout/CurrentWorkout";
import { api } from "@/trpc/react";
import { AI } from "@/app/action";
import Link from "next/link";

export function MessagesPage({
  isFreeTrial,
  isNewPro,
  freeTrialEndsAt,
}: {
  isFreeTrial: boolean;
  isNewPro: boolean;
  freeTrialEndsAt?: Date;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>() as {
    // idk why TS is being dumb here but it is and I like my types
    submitUserMessage: (message: string) => Promise<{
      id: number;
      display: ReactNode;
    }>;
  };

  const hasRunIsNewPro = useRef(false);
  useEffect(() => {
    if (isNewPro && !hasRunIsNewPro.current) {
      hasRunIsNewPro.current = true;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: (
            <SystemMessage
              message={
                "Welcome to the pro version, you now have full access FOREVER!"
              }
              needsSep={true}
            />
          ),
        },
      ]);
    }
  }, [isNewPro, setMessages]);

  const hasRunIsFreeTrial = useRef(false);
  useEffect(() => {
    if (isFreeTrial && !hasRunIsFreeTrial.current) {
      hasRunIsFreeTrial.current = true;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: (
            <SystemMessage
              message={
                "Welcome to the free trial!" +
                (freeTrialEndsAt
                  ? ` Your free trial ends on ${freeTrialEndsAt.toLocaleDateString()}`
                  : "")
              }
              needsSep={true}
            />
          ),
        },
      ]);
    }
  }, [isFreeTrial, setMessages, freeTrialEndsAt]);

  const activeWorkoutQuery = api.workout.getCurrentWorkout.useQuery();

  return (
    <div className="w-full h-screen flex flex-col relative">
      <CurrentWorkout />

      <div className="md:w-[800px] mx-auto flex flex-col items-start px-4">
        {
          // View messages in UI state
          messages.map((message) => (
            <div key={message.id} className="w-full">
              {message.display}
            </div>
          ))
        }
        <div className="bg-white w-full h-[300px]"></div>
      </div>

      <div className="fixed z-30 bottom-12 md:w-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-3 w-full px-4">
        <div className="flex flex-row gap-2 overflow-x-scroll no-scrollbar">
          {activeWorkoutQuery.data ? (
            <Button>
              <Link href={"/workout"}>Workout View</Link>
            </Button>
            // <Button
            //   type="button"
            //   variant={"outline"}
            //   className="border-slate-800 rounded-full"
            //   onClick={async (e) => {
            //     e.preventDefault();
            //     setIsLoading(true);
            //     const message = "Show me my current workout's information";
            //     // Add user message to UI state
            //     setMessages((currentMessages) => [
            //       ...currentMessages,
            //       {
            //         id: Date.now(),
            //         display: <UserMessage message={message} />,
            //       },
            //     ]);

            //     // Submit and get response message
            //     const responseMessage = await submitUserMessage(message);
            //     setMessages((currentMessages) => [
            //       ...currentMessages,
            //       responseMessage,
            //     ]);
            //     setIsLoading(false);
            //   }}
            // >
            //   Active Workout Info
            // </Button>
          ) : (
            <Button
              type="button"
              variant={"outline"}
              className="border-slate-800 rounded-full"
              onClick={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                const message = "Let me create a new workout";
                // Add user message to UI state
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <UserMessage message={message} />,
                  },
                ]);

                // Submit and get response message
                const responseMessage = await submitUserMessage(message);
                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ]);
                setIsLoading(false);
              }}
            >
              Create new Workout
            </Button>
          )}

          <Button
            type="button"
            variant={"outline"}
            className="border-slate-800 rounded-full"
            onClick={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const message = "Let me manage my schedule";
              // Add user message to UI state
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage message={message} />,
                },
              ]);

              // Submit and get response message
              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
              setIsLoading(false);
            }}
          >
            Create Schedule
          </Button>
          <Button
            type="button"
            variant={"outline"}
            onClick={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const message = "Show me all of my workouts";
              // Add user message to UI state
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage message={message} />,
                },
              ]);

              // Submit and get response message
              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
              setIsLoading(false);
            }}
            className="border-slate-800 rounded-full"
          >
            View all workouts
          </Button>
        </div>

        <form
          className=" bg-black py-2 px-6 rounded-full flex flex-row gap-4 "
          onSubmit={async (e) => {
            e.preventDefault();

            setIsLoading(true);
            // Add user message to UI state
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: Date.now(),
                display: <UserMessage message={inputValue} />,
              },
            ]);

            // Submit and get response message
            const responseMessage = await submitUserMessage(inputValue);
            setMessages((currentMessages) => [
              ...currentMessages,
              responseMessage,
            ]);

            setIsLoading(false);
            setInputValue("");
          }}
        >
          <Input
            placeholder="Send a message..."
            value={inputValue}
            className="border-0 text-white"
            disabled={isLoading}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-slate-800 hover:bg-slate-200"
          >
            {isLoading ? "Loading..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
