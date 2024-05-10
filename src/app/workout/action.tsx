import { openai } from "@/server/ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";

export interface WorkoutServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WorkoutClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

const sendWorkoutMessage = async (
  message: string
): Promise<WorkoutClientMessage> => {
  "use server";

  const history = getMutableAIState<typeof WorkoutAI>();

  // const model = groq("llama3-8b-8192");
  const model = openai("gpt-3.5-turbo");

  const result = await streamUI({
    model,
    messages: [...history.get(), { role: "user", content: message }],
    text: ({ content, done }) => {
      if (done) {
        const newHistory: WorkoutServerMessage[] = [
          ...history.get(),
          { role: "assistant", content },
        ];
        history.done(newHistory);
      }

      return <div>{content}</div>;
    },

    tools: {
      demo: {
        description:
          "Call this function when the user types 'demo' this is for debugging",
        parameters: z.object({}),
        generate: async function* () {
          yield <div>Cloning repository DEMO...</div>;
          await new Promise((resolve) => setTimeout(resolve, 3000));
          yield <div>Building repository DEMO...</div>;
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return <div>DEMO deployed!</div>;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
};

export const WorkoutAI = createAI<
  WorkoutServerMessage[],
  WorkoutClientMessage[]
>({
  actions: {
    sendWorkoutMessage,
  },
  initialAIState: [],
  initialUIState: [],
});
