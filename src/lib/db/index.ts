import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, { schema });
