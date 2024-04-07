import { AddExerciseCardServer } from "@/components/AddExerciseCardServer";
import CreateWorkoutCard from "@/components/CreateWorkoutCard";
import ExerciseCard from "@/components/ExerciseCard";
import { TestRSC } from "@/components/TestRSC";
import { UploadProgressPic } from "@/components/UploadProgressPic";
import ViewAllWorkouts from "@/components/ViewAllWorkouts";
import { WorkoutBreakdown } from "@/components/WorkoutBreakdown";
import { Suspense } from "react";

export default async function Home() {
  // testing loading some data
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      <CreateWorkoutCard />
      <UploadProgressPic />

      <Suspense fallback={<div>LOADING THE RSC</div>}>
        <TestRSC />
      </Suspense>

      <ExerciseCard />
      <AddExerciseCardServer initState={[]} />
    </main>
  );
}
