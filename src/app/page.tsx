import { SignInWithGitHub } from "@/components/supabase/SignInWithGitHub";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  console.log("user data", data);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      Welcome home
      <Link href="/playground">Playground</Link>
      <Link href="/messages">Messages Testing Land</Link>
      <SignInWithGitHub />
    </main>
  );
}
