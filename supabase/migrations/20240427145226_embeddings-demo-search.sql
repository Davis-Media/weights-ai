
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

CREATE TYPE "public"."role" AS ENUM (
    'user',
    'pro',
    'admin'
);

ALTER TYPE "public"."role" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."embeddings" (
    "id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "embedding" "extensions"."vector"(384)
);

ALTER TABLE "public"."embeddings" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."query_embeddings"("search_embedding" "extensions"."vector", "match_threshold" double precision) RETURNS SETOF "public"."embeddings"
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select *
  from embeddings

  -- The inner product is negative, so we negate match_threshold
  where embeddings.embedding <#> search_embedding < -match_threshold

  -- Our embeddings are normalized to length 1, so cosine similarity
  -- and inner product will produce the same query results.
  -- Using inner product which can be computed faster.
  --
  -- For the different distance functions, see https://github.com/pgvector/pgvector
  order by embeddings.embedding <#> search_embedding;
end;
$$;

ALTER FUNCTION "public"."query_embeddings"("search_embedding" "extensions"."vector", "match_threshold" double precision) OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_exercise" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "embedding" "extensions"."vector"(384)
);

ALTER TABLE "public"."user_exercise" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."query_embeddings_user_exercise"("search_embedding" "extensions"."vector", "match_threshold" double precision, "search_profile_id" "uuid") RETURNS SETOF "public"."user_exercise"
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select *
  from user_exercise

  -- The inner product is negative, so we negate match_threshold
  where user_exercise.embedding <#> search_embedding < -match_threshold and user_exercise.profile_id = search_profile_id

  -- Our embeddings are normalized to length 1, so cosine similarity
  -- and inner product will produce the same query results.
  -- Using inner product which can be computed faster.
  --
  -- For the different distance functions, see https://github.com/pgvector/pgvector
  order by user_exercise.embedding <#> search_embedding;
end;
$$;

ALTER FUNCTION "public"."query_embeddings_user_exercise"("search_embedding" "extensions"."vector", "match_threshold" double precision, "search_profile_id" "uuid") OWNER TO "postgres";

ALTER TABLE "public"."embeddings" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."embeddings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile" (
    "id" "uuid" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."role" DEFAULT 'user'::"public"."role" NOT NULL,
    "created_at" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."profile" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."set" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "weight" integer NOT NULL,
    "reps" integer NOT NULL,
    "user_exercise_id" "uuid" NOT NULL,
    "workout_id" "uuid" NOT NULL
);

ALTER TABLE "public"."set" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_schedule" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "day" integer NOT NULL,
    "profile_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_schedule" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_schedule_entry" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order" integer NOT NULL,
    "user_exercise_id" "uuid" NOT NULL,
    "user_schedule_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_schedule_entry" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workout" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "location" "text" NOT NULL,
    "name" "text" NOT NULL,
    "in_progress" boolean DEFAULT false NOT NULL,
    "ended_at" timestamp with time zone,
    "profile_id" "uuid" NOT NULL
);

ALTER TABLE "public"."workout" OWNER TO "postgres";

ALTER TABLE ONLY "public"."embeddings"
    ADD CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "set_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_exercise"
    ADD CONSTRAINT "user_exercise_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_schedule_entry"
    ADD CONSTRAINT "user_schedule_entry_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_schedule"
    ADD CONSTRAINT "user_schedule_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."workout"
    ADD CONSTRAINT "workout_pkey" PRIMARY KEY ("id");

CREATE INDEX "embeddings_embedding_idx" ON "public"."embeddings" USING "hnsw" ("embedding" "extensions"."vector_ip_ops");

CREATE INDEX "user_exercise_embedding_idx" ON "public"."user_exercise" USING "hnsw" ("embedding" "extensions"."vector_ip_ops");


ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "set_user_exercise_id_user_exercise_id_fk" FOREIGN KEY ("user_exercise_id") REFERENCES "public"."user_exercise"("id");

ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "set_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id");

ALTER TABLE ONLY "public"."user_exercise"
    ADD CONSTRAINT "user_exercise_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id");

ALTER TABLE ONLY "public"."user_schedule_entry"
    ADD CONSTRAINT "user_schedule_entry_user_exercise_id_user_exercise_id_fk" FOREIGN KEY ("user_exercise_id") REFERENCES "public"."user_exercise"("id");

ALTER TABLE ONLY "public"."user_schedule_entry"
    ADD CONSTRAINT "user_schedule_entry_user_schedule_id_user_schedule_id_fk" FOREIGN KEY ("user_schedule_id") REFERENCES "public"."user_schedule"("id");

ALTER TABLE ONLY "public"."user_schedule"
    ADD CONSTRAINT "user_schedule_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id");

ALTER TABLE ONLY "public"."workout"
    ADD CONSTRAINT "workout_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id");

ALTER TABLE "public"."embeddings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."set" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_exercise" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_schedule" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_schedule_entry" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."embeddings" TO "anon";
GRANT ALL ON TABLE "public"."embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."embeddings" TO "service_role";

GRANT ALL ON TABLE "public"."user_exercise" TO "anon";
GRANT ALL ON TABLE "public"."user_exercise" TO "authenticated";
GRANT ALL ON TABLE "public"."user_exercise" TO "service_role";

GRANT ALL ON SEQUENCE "public"."embeddings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."embeddings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."embeddings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";

GRANT ALL ON TABLE "public"."set" TO "anon";
GRANT ALL ON TABLE "public"."set" TO "authenticated";
GRANT ALL ON TABLE "public"."set" TO "service_role";

GRANT ALL ON TABLE "public"."user_schedule" TO "anon";
GRANT ALL ON TABLE "public"."user_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."user_schedule" TO "service_role";

GRANT ALL ON TABLE "public"."user_schedule_entry" TO "anon";
GRANT ALL ON TABLE "public"."user_schedule_entry" TO "authenticated";
GRANT ALL ON TABLE "public"."user_schedule_entry" TO "service_role";

GRANT ALL ON TABLE "public"."workout" TO "anon";
GRANT ALL ON TABLE "public"."workout" TO "authenticated";
GRANT ALL ON TABLE "public"."workout" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--

