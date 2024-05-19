"use client";
import { createClient } from "@/server/sb/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);

  const [isOpen, setIsOpen] = useState(false);

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
    <header className="px-4 lg:px-6 flex md:items-center md:py-2 py-4 flex-col md:flex-row">
      <div className="flex flex-row justify-between items-center">

        <Link className="flex justify-center flex-col" href="/">
          <h1 className="md:text-xl font-bold">Weights AI</h1>
          <p className="text-sm font-light text-gray-400">By Big Stair</p>
        </Link>
        <Button variant={"ghost"} onClick={() => setIsOpen(!isOpen)} className=" md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* MOBILE */}
      <nav className={`flex-col gap-2 w-full py-4 ${isOpen ? "flex" : "hidden"}`}>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/support"
        >
          Support & Feedback
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="https://github.com/bmdavis419/weights-ai"
          target="_blank"
        >
          GitHub
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

      <nav className="ml-auto md:flex gap-4 sm:gap-6 hidden">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/support"
        >
          Support & Feedback
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="https://github.com/bmdavis419/weights-ai"
          target="_blank"
        >
          GitHub
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
