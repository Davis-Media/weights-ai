import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ViewWorkoutDetails } from "./ViewAllWorkoutsDetails";

type ViewAllWorkoutsProps = {
  workouts: {
    name: string;
    date: Date;
    id: string;
    profileId: string;
    location: string;
    inProgress: boolean;
    endedAt: Date | null;
  }[];
};

export default async function ViewAllWorkouts(props: ViewAllWorkoutsProps) {
  const { workouts } = props;

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
