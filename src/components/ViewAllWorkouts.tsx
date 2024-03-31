import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { getAllWorkouts } from "@/lib/db/helper";
import { ViewWorkoutDetails } from "./ViewAllWorkoutsDetails";

export default async function ViewAllWorkouts() {
  const workouts = await getAllWorkouts();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Workouts</CardTitle>
        <CardDescription>View your workouts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-2 border-t border-gray-200 last:border-0 dark:border-gray-800">
          {workouts.map((workout) => {
            return <ViewWorkoutDetails workout={workout} key={workout.id} />;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
