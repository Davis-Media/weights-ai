/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "npm:@supabase/supabase-js@2.42.0";
import { Database } from "../_shared/database.types.ts";

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const { search, profile_id } = await req.json();
  if (!search) return new Response("Please provide a search param!");
  if (!profile_id) return new Response("Please provide a profile_id param!");
  // Generate embedding for search term.
  const embedding = await model.run(search, {
    mean_pool: true,
    normalize: true,
  });

  // Query embeddings.
  const { data: result, error } = await supabase
    .rpc("query_embeddings_user_exercise", {
      search_embedding: JSON.stringify(embedding),
      match_threshold: 0.6,
      search_profile_id: profile_id,
    })
    .select("name, id")
    .limit(4);
  if (error) {
    return Response.json(error);
  }

  return Response.json({ search, result });
});
