/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// deno-lint-ignore ban-ts-comment
// @ts-ignore
const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const input = params.get("input");
  const output = await model.run(input, { mean_pool: true, normalize: true });
  return new Response(JSON.stringify(output), {
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/embed-test' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
