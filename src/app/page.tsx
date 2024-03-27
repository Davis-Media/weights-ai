import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      Welcome home
      <Link href="/playground">Playground</Link>
    </main>
  );
}
