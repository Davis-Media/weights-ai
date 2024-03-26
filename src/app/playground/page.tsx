import AddExerciseCard from "@/components/AddExerciseCard";
import CreateWorkoutCard from "@/components/CreateWorkoutCard";
import ExerciseCard from "@/components/ExerciseCard";
import ViewAllWorkouts from "@/components/ViewAllWorkouts";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default async function Home() {
  // testing loading some data
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <CreateWorkoutCard />
        <ViewAllWorkouts />
      </SignedIn>
      <ExerciseCard />
      <AddExerciseCard />
    </main>
  );
}
