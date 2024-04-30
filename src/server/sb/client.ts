import { env } from "@/env";
import { createBrowserClient } from "@supabase/ssr";

// yea I know this is in the server folder, its not for the server, but fuck you who cares

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
