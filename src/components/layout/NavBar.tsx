"use client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    run();
  }, []);
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <MountainIcon />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Contact
        </Link> */}

        {user ? (
          <>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/messages"
            >
              Messages
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/auth/logout"
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/auth/login"
          >
            Login/Signup
          </Link>
        )}
      </nav>
    </header>
  );
};

function MountainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
