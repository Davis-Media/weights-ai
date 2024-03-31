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
import { Suspense } from "react";
import { TestRSC } from "@/components/TestRSC";
import { AddExerciseCardServer } from "@/components/AddExerciseCardServer";
import { UploadProgressPic } from "@/components/UploadProgressPic";

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
                  .enum(["bench", "deadlift"])
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
          const content = createStreamableUI(
            <div>
              <SystemMessage
                needsSep={false}
                message="Add your set here, once you are done go ahead and hit save!"
              />
              <Suspense fallback={<div>Loading...</div>}>
                <AddExerciseCardServer initState={test.initState} />
              </Suspense>
            </div>
          );

          return content.value;
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

          // need to make this stream-able so that suspense works
          const content = createStreamableUI(
            <div>
              <SystemMessage
                needsSep={false}
                message="Here are all of your workouts!"
              />
              <div className="bg-blue-200 my-2">
                <Suspense fallback={<div>LOADING TEST RSC</div>}>
                  <TestRSC />
                </Suspense>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <ViewAllWorkouts />
              </Suspense>
            </div>
          );

          return content.value;
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

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
