"use client";

import { Card } from "../ui/card";
import { api } from "@/trpc/react";

export function CurrentWorkout() {
  const curWorkoutQuery = api.workout.getCurrentWorkout.useQuery();

  if (curWorkoutQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="md:fixed top-12 right-12 bg-black text-slate-100 py-2 px-6 rounded-full mx-auto block">
      {curWorkoutQuery.data ? (
        // in progress workout real
        <div className="flex flex-row gap-4 items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg">{curWorkoutQuery.data.name}</h2>
            <h4 className="font-light text-sm text-slate-400">
              {curWorkoutQuery.data.location}
            </h4>
          </div>
        </div>
      ) : (
        <div>NO WORKOUT IN PROGRESS</div>
      )}
    </Card>
  );
}
