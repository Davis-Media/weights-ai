import { createOpenAI } from "@ai-sdk/openai";
import { observeOpenAI } from "langfuse";

// export const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: env.GROQ_API_KEY,
// });

export const openai = observeOpenAI(createOpenAI(), {
  traceId: "weights-ai-main-openai",
});
