import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Separator } from "./ui/separator";

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
  const { user, isLoaded } = useUser();
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={user ? user.imageUrl : "/default.jpg"}
          width={30}
          height={30}
          className="rounded-full"
          alt="User Pic"
        />
        <h2 className="font-bold text-lg text-slate-900">
          {!isLoaded ? (
            <span>...loading</span>
          ) : (
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          )}
        </h2>
      </div>
      <p>{props.message}</p>
    </div>
  );
}
