"use client";
import { createClient } from "@/server/sb/client";
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
    <header className="px-4 lg:px-6 h-14 flex items-center md:py-2">
      <Link className="flex justify-center flex-col" href="/">
        <h1 className="text-xl font-bold">Weights AI</h1>
        <p className="text-sm font-light text-gray-400">By Big Stair</p>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Contact
        </Link> */}

        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/support"
        >
          Support & Feedback
        </Link>
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
              href="/profile"
            >
              Profile
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
