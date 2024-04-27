create extension if not exists vector with schema extensions;

create table embeddings (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector (384)
);
alter table embeddings enable row level security;

create index on embeddings using hnsw (embedding vector_ip_ops);

-- FOR LOCAL TESTING ONLY. REMOVE OR COMMENT OUT WHEN PUSHING TO HOSTED PROJECT!

CREATE TRIGGER "on_inserted_or_updated_embedding"
AFTER INSERT
OR
UPDATE OF content ON public.embeddings FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request (
  'http://kong:8000/functions/v1/generate-embedding',
  'POST',
  '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"}',
  '{}',
  '5000'
);