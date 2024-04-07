"use client";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function SystemMessage(props: { message: string; needsSep: boolean }) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={"/system.jpg"}
          width={30}
          height={30}
          className="rounded-full"
          alt="User Pic"
        />
        <h2 className="font-bold text-lg text-slate-900">Workout Assistant</h2>
      </div>
      <p>{props.message}</p>
      {props.needsSep && <Separator />}
    </div>
  );
}

export function UserMessage(props: { message: string }) {
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
    <div className="flex flex-col gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={user ? user.user_metadata.avatar_url : "/default.jpg"}
          width={30}
          height={30}
          className="rounded-full"
          alt="User Pic"
        />
        <h2 className="font-bold text-lg text-slate-900">
          <span>{user?.user_metadata.full_name}</span>
        </h2>
      </div>
      <p>{props.message}</p>
    </div>
  );
}
