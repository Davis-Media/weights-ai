import { getInProgressWorkout } from "@/lib/db/helper";
import AddExerciseCardClient from "./AddExerciseCardClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export async function AddExerciseCardServer(props: {
  initState: {
    exercise: string;
    reps: number;
    weight: number;
  }[];
}) {
  const { initState } = props;

  // ensure that the user has a selected workout
  const workout = await getInProgressWorkout();

  if (!workout)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise(s)</CardTitle>
          <CardDescription>Enter your exercise details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>You need to have an active workout in order to add exercises</p>
        </CardContent>
      </Card>
    );
  return <AddExerciseCardClient initState={initState} />;
}
