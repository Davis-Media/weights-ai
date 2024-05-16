"use client";
import Image from "next/image";
import { createClient } from "@/server/sb/client";
import { type User } from "@supabase/supabase-js";
import { type ReactNode, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { api } from "@/trpc/react";

export function SystemMessage(props: {
  message: string;
  needsSep: boolean;
  richMessage?: ReactNode;
}) {
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
      {props.richMessage}
      {props.needsSep && <Separator />}
    </div>
  );
}

export function UserMessage(props: { message: string }) {
  const [user, setUser] = useState<User | null>(null);

  const profileQuery = api.user.getUserProfile.useQuery();

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
          <span>
            {profileQuery.data
              ? profileQuery.data.firstName + " " + profileQuery.data.lastName
              : "User"}
          </span>
        </h2>
      </div>
      <p>{props.message}</p>
    </div>
  );
}
