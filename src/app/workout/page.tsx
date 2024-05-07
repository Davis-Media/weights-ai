import WorkoutPage from "@/components/client-pages/workout";
import { api } from "@/trpc/server";

export default async function Page() {
  const currentWorkout = await api.workout.getCurrentWorkout();

  if (!currentWorkout) {
    return <div>No workout found</div>;
  }

  return (
    <div>
      <WorkoutPage workoutId={currentWorkout.id} />
    </div>
  );
}
