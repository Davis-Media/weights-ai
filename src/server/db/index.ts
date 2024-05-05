import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/env";
import { Redis } from "@upstash/redis";

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

export const redis = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
});
