import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllWorkouts } from "@/lib/db/helper";

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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
