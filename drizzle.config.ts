import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  driver: "pg",
  out: "./supabase/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
