import "server-only";
import { OpenAI } from "openai";
import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  render,
} from "ai/rsc";
import z from "zod";
import CreateWorkoutCard from "@/components/CreateWorkoutCard";
import { SystemMessage } from "@/components/Messages";
import ViewAllWorkouts from "@/components/ViewAllWorkouts";
import { AddExerciseCardServer } from "@/components/AddExerciseCardServer";
import { UploadProgressPic } from "@/components/UploadProgressPic";
import {
  getAllWorkouts,
  getInProgressWorkout,
  getWorkoutInfo,
} from "@/lib/db/helper";
import { WorkoutBreakdown } from "@/components/WorkoutBreakdown";
import { Suspense } from "react";
import { TestRSC } from "@/components/TestRSC";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    messages: [
      {
        role: "system",
        content: `\
        You are a personal weights tracker for the gym. You can be asked to start workouts, and to record information for a users sets.
  If you can't find an appropriate function, tell the user to ask
  a different question.
    `,
      },
      { role: "user", content: userInput },
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }
      return <SystemMessage message={content} needsSep={true} />;
    },
    tools: {
      rsc_demo: {
        description:
          "Call this function when the user types 'demo' this is for debugging",
        parameters: z.object({}),
        render: async function* () {
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "rsc_demo",
              content: "the user called rsc_demo, this is a debugging function",
            },
          ]);

          const streamUI = createStreamableUI(<div>test start</div>);

          streamUI.update(
            <div>
              <h2>this does work?</h2>
              <Suspense fallback={<div>LOADING TEST RSC?!?!?!?</div>}>
                <TestRSC done={streamUI.done} />
              </Suspense>
            </div>
          );

          return streamUI.value;
        },
      },
      view_current_workout: {
        description:
          "Allows the user to view their current workout and its information",
        parameters: z.object({}),
        render: async function* () {
          yield <div>fetching...</div>;

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "view_current_workout",
              content:
                "user has been given a card to view the status of their current workout",
            },
          ]);

          const curWorkout = await getInProgressWorkout();

          if (!curWorkout) {
            return (
              <SystemMessage
                needsSep={true}
                message="No currently active workout..."
              />
            );
          }

          const workoutInfo = await getWorkoutInfo(curWorkout.id);
          if (!workoutInfo) {
            return (
              <SystemMessage
                needsSep={true}
                message="No currently active workout..."
              />
            );
          }

          return (
            <div>
              <SystemMessage
                needsSep={false}
                message="Here is your current workout:"
              />
              <WorkoutBreakdown workoutInfo={workoutInfo} />
            </div>
          );
        },
      },
      add_progress_picture: {
        description:
          "Allow the user to upload a progress picture of themselves for their workout",
        parameters: z.object({}),
        render: async function* () {
          yield <div>fetching...</div>;

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "add_progress_picture",
              content:
                "provided the UI for the user to upload a progress picture",
            },
          ]);

          return (
            <div>
              <SystemMessage
                needsSep={false}
                message="Upload your progress photo here!"
              />
              <UploadProgressPic />
            </div>
          );
        },
      },
      add_sets: {
        description:
          "Allow the user to input their sets and add exercises to their currently active workout. You can pass in some init state if they give you info in their prompt.",
        parameters: z
          .object({
            initState: z.array(
              z.object({
                exercise: z
                  .enum(["bench", "deadlift", "squat"])
                  .describe("The exercise the user did"),
                reps: z
                  .number()
                  .describe("The number of reps they did of that exercise"),
                weight: z
                  .number()
                  .describe("The amount of weight that the user did"),
              })
            ),
          })
          .required(),
        render: async function* (props) {
          yield <div>fetching...</div>;

          const test = JSON.parse(props as unknown as string);

          console.log(test);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "add_sets",
              content:
                "provided the UI for the user to add sets to their workout",
            },
          ]);

          // need to make this stream-able so that suspense works
          return (
            <div>
              <SystemMessage
                needsSep={false}
                message="Add your set here, once you are done go ahead and hit save!"
              />
              <AddExerciseCardServer initState={test.initState} />
            </div>
          );
        },
      },
      view_all_workouts: {
        description:
          "Allow the user to view all of their past workouts in a nice table",
        parameters: z.object({}),
        render: async function* () {
          yield <div>fetching...</div>;

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "create_new_workout",
              content: "provided the UI for the user to view their workouts",
            },
          ]);

          const workouts = await getAllWorkouts();

          return (
            <div>
              <SystemMessage
                needsSep={false}
                message="Here are all of your workouts!"
              />
              <ViewAllWorkouts workouts={workouts} />
            </div>
          );
        },
      },
      create_new_workout: {
        description:
          "Provide the user with the UI to create a new workout, this is NOT for when the user wants to add an exercise like bench press",
        parameters: z.object({}),
        render: async function* () {
          yield <div>LOADING...</div>;

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "create_new_workout",
              content: "provided the UI for the user to create a new workout",
            },
          ]);

          return (
            <div>
              <SystemMessage
                needsSep={false}
                message="Lets get your workout info ready, once you submit, your workout will automatically start!"
              />
              <CreateWorkoutCard />
            </div>
          );
        },
      },
    },
  });
  return {
    id: Date.now(),
    display: ui,
  };
}

export const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

export const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [
  {
    id: Date.now(),
    display: (
      <SystemMessage
        message="Hi! I am a personal workout logging system. The way this works is you can create workouts, activate them, then add your sets! Let me know how I can be of help."
        needsSep={true}
      />
    ),
  },
];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
