"use client";

import { Button } from "../ui/button";
import { useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { SystemMessage } from "../Messages";
import { setWorkoutInProgress } from "@/server/helper/workout";
import { useQueryClient } from "@tanstack/react-query";

export function ViewWorkoutDetails(props: {
  workout: {
    name: string;
    date: Date;
    id: string;
    profileId: string;
    location: string;
    inProgress: boolean;
    endedAt: Date | null;
  };
}) {
  const { workout } = props;
  const [_, setMessages] = useUIState<typeof AI>();

  const queryClient = useQueryClient();

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
            workout.inProgress ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <Button
          size="sm"
          disabled={workout.inProgress}
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

            await queryClient.invalidateQueries({
              queryKey: ["currentWorkout"],
            });
            await queryClient.invalidateQueries({
              queryKey: ["active_workout"],
            });
          }}
        >
          {workout.inProgress ? "In Progress..." : "Start"}
        </Button>
      </div>
    </div>
  );
}
