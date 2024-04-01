"use client";

import { setWorkoutInProgress } from "@/lib/db/helper";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { SystemMessage } from "./Messages";

export function ViewWorkoutDetails(props: {
  workout: {
    id: string;
    name: string;
    location: string;
    date: Date;
    inProgress: boolean;
    userId: string;
  };
}) {
  const { workout } = props;
  const [_, setMessages] = useUIState<typeof AI>();

  const router = useRouter();

  return (
    <div className="flex flex-row items-center p-4 gap-4" key={workout.id}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium leading-none">{workout.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            {workout.location}
          </p>
        </div>
        <p className="text-slate-500 text-sm">
          {workout.date.toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-row items-center space-x-2 ml-auto">
        <div
          className={`w-2 h-2 rounded-full ${
            workout.inProgress ? "bg-yellow-500" : "bg-green-500"
          }`}
        />
        <Button
          size="sm"
          onClick={async () => {
            await setWorkoutInProgress(workout.id);
            setMessages([
              {
                id: new Date().getMilliseconds(),
                display: (
                  <SystemMessage
                    needsSep={true}
                    message="Selected new workout!"
                  />
                ),
              },
            ]);
            router.refresh();
          }}
        >
          Activate
        </Button>
      </div>
    </div>
  );
}
