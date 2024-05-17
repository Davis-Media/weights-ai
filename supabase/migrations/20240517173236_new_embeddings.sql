ALTER TABLE "public"."user_exercise" ADD COLUMN "name_openai_embedding" vector(1536);

CREATE INDEX "user_exercise_name_openai_embedding_idx" ON "public"."user_exercise" USING "hnsw" ("name_openai_embedding" "vector_cosine_ops");