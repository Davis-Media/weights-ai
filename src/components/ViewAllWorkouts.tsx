import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllExercises, getAllWorkouts } from "@/lib/db/helper";
import { Separator } from "./ui/separator";

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
            return (
              <>
                <div
                  className="flex flex-row items-center p-4 gap-4"
                  key={workout.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium leading-none">
                        {workout.name}
                      </h3>
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
                    <Button size="sm">Details</Button>
                  </div>
                </div>
                <WorkoutDetails workoutId={workout.id} />
              </>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

async function WorkoutDetails(props: { workoutId: string }) {
  // get all the exercises associated with the workout
  const exercises = await getAllExercises(props.workoutId);

  return (
    <div>
      <Separator />
      <ul>
        {exercises.map((exercise) => {
          return (
            <li key={exercise.id}>
              <h3>{exercise.lift}</h3>
              <p>
                {exercise.weight} x {exercise.reps}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
