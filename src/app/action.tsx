import "server-only";
import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import z from "zod";
import CreateWorkoutCard from "@/components/CreateWorkoutCard";

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
      return <div>{content}</div>;
    },
    tools: {
      create_new_workout: {
        description:
          "Provide the user with the UI to create a new workout, and once it is created set it is the currently selected workout",
        parameters: z.object({}),
        render: async function* () {
          yield <div>LOADING...</div>;

          // const house = await getHouses(limit)

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "create_new_workout",
              content: "provided the UI for the user to create a new workout",
            },
          ]);

          return <CreateWorkoutCard />;
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
}[] = [
  {
    id: 0,
    display: <div>Hello! This is some sample init state...</div>,
  },
];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
