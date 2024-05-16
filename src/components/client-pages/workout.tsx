"use client";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CopyCheck, Send, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useActions, useUIState } from "ai/rsc";
import { useMemo, useState } from "react";
import { WorkoutAI } from "@/app/workout/action";
import { nanoid } from "nanoid";
import { UserMessage } from "../Messages";
import { redirect, useRouter } from "next/navigation";

type WorkoutPageProps = {
  workoutId: string;
};

export default function WorkoutPage(props: WorkoutPageProps) {
  const { workoutId } = props;
  const workoutDetailsQuery = api.workout.getFullWorkoutDetails.useQuery({
    workoutId,
  });

  // AI stuff
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState<typeof WorkoutAI>();
  const { sendWorkoutMessage } = useActions();
  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();

  const router = useRouter();

  const remainingExercises = useMemo(() => {
    const remaining: string[] = [];
    if (workoutDetailsQuery.data && workoutDetailsQuery.data.schedule) {
      workoutDetailsQuery.data.schedule.userScheduleEntries.forEach((se) => {
        // check if the exercise has been added
        const idx = workoutDetailsQuery.data.exercises.findIndex(
          (ex) => ex.id === se.userExercise.id
        );
        if (idx === -1) {
          remaining.push(se.userExercise.name);
        }
      });
    }
    return remaining;
  }, [workoutDetailsQuery.data]);

  const duplicateSetMutation = api.sets.duplicateSet.useMutation({
    onSuccess: () => {
      utils.workout.getFullWorkoutDetails.invalidate();
    },
  });

  const completeWorkoutMutation = api.workout.completeWorkout.useMutation({
    onSuccess: () => {
      router.push("/messages");
    },
  });

  const deleteSetMutation = api.sets.deleteSet.useMutation({
    onSuccess: () => {
      utils.workout.getFullWorkoutDetails.invalidate();
    },
  });

  if (workoutDetailsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (workoutDetailsQuery.isError) {
    return <div>Error: {workoutDetailsQuery.error.message}</div>;
  }

  if (!workoutDetailsQuery.data) {
    return <div>No workout found</div>;
  }

  return (
    <div
      key="1"
      className="grid grid-rows-12 grid-cols-1 md:w-[700px] w-full px-4 md:px-0 justify-between grow  max-h-screen"
    >
      <Card className="w-full row-span-3 overflow-scroll no-scrollbar">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {workoutDetailsQuery.data.workoutName}
              <div className="text-sm font-medium text-gray-500 mt-1">
                {workoutDetailsQuery.data.location} -{" "}
                {workoutDetailsQuery.data.date.toLocaleDateString()}
              </div>
            </CardTitle>
            <Button
              className="text-sm font-bold px-6 py-3 bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors"
              variant="secondary"
              onClick={() => {
                completeWorkoutMutation.mutate({
                  workoutId,
                });
              }}
            >
              Finish
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {workoutDetailsQuery.data.exercises.map((e) => (
            <Collapsible className="space-y-3" key={e.name}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>{e.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2">{e.keySetInfo}</span>
                    <CollapsibleTrigger asChild>
                      <Button className="ml-auto" size="icon" variant="ghost">
                        <ChevronDownIcon />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <Separator className="my-2" />
                <CollapsibleContent>
                  <ul className="space-y-2">
                    {e.sets.map((s, idx) => (
                      <li className="flex justify-between gap-1" key={idx}>
                        <span>Set {idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size={"icon"}
                            disabled={duplicateSetMutation.isPending}
                            className="bg-green-600"
                            onClick={() =>
                              duplicateSetMutation.mutate({ setId: s.id })
                            }
                          >
                            <CopyCheck className="w-3 h-3" />
                          </Button>
                          <Button
                            size={"icon"}
                            disabled={deleteSetMutation.isPending}
                            className="bg-red-600"
                            onClick={() =>
                              deleteSetMutation.mutate({ setId: s.id })
                            }
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                          <span>
                            {s.weight} x {s.reps}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
        <CardFooter>
          {workoutDetailsQuery.data.schedule ? (
            <div>
              <h3>Remaining Exercises for Today:</h3>

              <div>
                {remainingExercises.map((e) => (
                  <div key={e}>{e}</div>
                ))}
                {/* {workoutDetailsQuery.data.schedule.userScheduleEntries.map(
                  (se) => {
                    return (
                      <div key={se.id}>
                        <h3 className="text-slate-900 font-bold">
                          {se.userExercise.name}
                        </h3>
                      </div>
                    );
                  }
                )} */}
              </div>
            </div>
          ) : (
            <h3>No schedule found for today, have fun!</h3>
          )}
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-4 justify-start p-4 overflow-scroll row-span-7 no-scrollbar">
        {conversation.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))}
      </div>
      <div className="w-full row-span-2 flex items-start justify-center py-4 ">
        <form
          className=" bg-black py-2 px-6 rounded-full flex flex-row gap-4 w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            // Add user message to UI state

            setConversation((currentConversation) => [
              ...currentConversation,
              {
                id: nanoid(),
                role: "user",
                display: <UserMessage message={input} />,
              },
            ]);

            const message = await sendWorkoutMessage(input);

            setConversation((currentConversation) => [
              ...currentConversation,
              message,
            ]);

            // this is kinda inelegant, but should work MOST of the time
            setTimeout(() => {
              utils.workout.getFullWorkoutDetails.invalidate();
            }, 3000);

            setIsLoading(false);
            setInput("");
          }}
        >
          <Input
            placeholder="Manage your workout..."
            className="border-0 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-white text-slate-800 hover:bg-slate-200"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg
      className="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}
