/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "npm:@supabase/supabase-js@2.42.0";
import { Database, Tables } from "../_shared/database.types.ts";

type ExerciseRecord = Tables<"user_exercise">;
interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: ExerciseRecord;
  schema: "public";
  old_record: null | ExerciseRecord;
}

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  const { name, id } = payload.record;

  // Check if content has changed.
  if (name === payload?.old_record?.name) {
    return new Response("ok - no change");
  }

  // Generate embedding
  const embedding = await model.run(name, {
    mean_pool: true,
    normalize: true,
  });

  // Store in DB
  const { error } = await supabase.from("user_exercise").update({
    embedding: JSON.stringify(embedding),
  }).eq(
    "id",
    id,
  );
  if (error) console.warn(error.message);

  return new Response("ok - updated");
});
