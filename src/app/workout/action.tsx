import { openai } from "@/server/ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { env } from "@/env";
import { getOrCreateProfile } from "@/server/helper/auth";
import { SystemMessage } from "@/components/Messages";
import { api } from "@/trpc/server";

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

  // ensure that the user is logged in
  const { profile, error } = await getOrCreateProfile();
  if (error || !profile) {
    return {
      id: nanoid(),
      role: "assistant",
      display: <SystemMessage message={error} needsSep={true} />,
    };
  }

  const history = getMutableAIState<typeof WorkoutAI>();

  // const model = groq("llama3-8b-8192");
  const model = openai("gpt-3.5-turbo", {});

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
      add_set: {
        description: "Call this function to add a set to the user's workout",
        parameters: z.object({
          weight: z.number().describe("the weight of the user's set"),
          reps: z.number().describe("the number of reps for the user's set"),
          exercise: z
            .string()
            .describe("the name of the user's exercise, ex. bench press"),
        }),
        generate: async function* (params) {
          yield <div>Adding set to workout...</div>;

          // figure out the user set id
          // search using the edge function
          const supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          const res = await fetch(
            `${supabaseURL}/functions/v1/search-exercise`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${supabaseAnonKey}`,
              },
              body: JSON.stringify({
                search: params.exercise,
                profile_id: profile.id,
              }),
            }
          );

          const data = (await res.json()) as {
            search: string;
            result: {
              name: string;
              id: string;
            }[];
          };

          if (data.result.length === 0) {
            return (
              <SystemMessage
                needsSep={true}
                message="I couldn't find that exercise, please try again!"
              />
            );
          }

          api.sets.saveNewSets({
            sets: [
              {
                weight: params.weight,
                reps: params.reps,
                exerciseId: data.result[0].id,
              },
            ],
          });

          return <div>Added {params.exercise}!</div>;
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
