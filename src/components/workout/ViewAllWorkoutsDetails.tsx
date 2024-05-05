"use client";

import { Button } from "../ui/button";
import { useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { SystemMessage } from "../Messages";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const utils = api.useUtils();

  const setInprogressMutation = api.workout.setWorkoutInProgress.useMutation({
    onSuccess: async () => {
      setMessages([
        {
          id: new Date().getMilliseconds(),
          display: (
            <SystemMessage
              needsSep={true}
              message="Workout set to in progress!"
            />
          ),
        },
      ]);
      await utils.workout.invalidate();
    },
  });

  const deleteMutation = api.workout.deleteWorkout.useMutation({
    onSuccess: async () => {
      setMessages([
        {
          id: new Date().getMilliseconds(),
          display: <SystemMessage needsSep={true} message="Workout deleted!" />,
        },
      ]);
      await utils.workout.invalidate();
    },
  });

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
        <Dialog>
          <DialogTrigger
            disabled={workout.inProgress || deleteMutation.isPending}
          >
            Delete Workout
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                workout and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  deleteMutation.mutate({ workoutId: workout.id });
                }}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          disabled={workout.inProgress}
          onClick={() => {
            setInprogressMutation.mutate({ workoutId: workout.id });
          }}
        >
          {workout.inProgress ? "In Progress..." : "Start"}
        </Button>
      </div>
    </div>
  );
}
