import { AddExerciseCardServer } from "@/components/exercise/AddExerciseCardServer";
import ExerciseCard from "@/components/exercise/ExerciseCard";
import { TestRSC } from "@/components/TestRSC";
import { ManageSchedule } from "@/components/schedule/ManageSchedule";
import { Suspense } from "react";

export default async function Home() {
  // testing loading some data
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      <Suspense fallback={<div>LOADING THE RSC</div>}>
        <TestRSC />
      </Suspense>

      <ManageSchedule />

      <ExerciseCard />
      <AddExerciseCardServer initState={[]} />
    </main>
  );
}
