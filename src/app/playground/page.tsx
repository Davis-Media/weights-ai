import { openaiEmbeddingModel, openaiModel } from "@/server/ai";
import { embed, generateText } from "ai"


export default async function Home() {
  // testing loading some data

  const embedding = await embed({
    model: openaiEmbeddingModel,
    value: "FORM 4: Jeb Bush traded 100 shares of Bud Light for $50 each on 2022-04-22"
  })

  const queryRes = await generateText({
    model: openaiModel,
    prompt: `What extra data am I providing in this query?
    ## this data contains all of Jeb Bush's trades in the form of a vector embedding
    ${embedding.embedding} 
    `
  })



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      {queryRes.text}
    </main>
  );
}
