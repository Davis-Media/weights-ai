"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { completeWorkout } from "@/lib/helper/workout";
import { useRouter } from "next/navigation";
import { useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { SystemMessage } from "./Messages";

export default function CompleteWorkoutCard({
  workoutId,
}: {
  workoutId: string;
}) {
  const [_, setMessages] = useUIState<typeof AI>();
  const router = useRouter();

  const submit = async () => {
    console.log("Submitting workout");

    await completeWorkout(workoutId);

    setMessages([
      {
        id: new Date().getMilliseconds(),
        display: <SystemMessage needsSep={true} message="Workout completed!" />,
      },
    ]);
    router.refresh();
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Finish Workout</CardTitle>
        <CardDescription>
          Are you ready to finish your workout? Once you complete it, you can
          re-activate it later if you want.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button onClick={submit}>Finish Workout</Button>
      </CardFooter>
    </Card>
  );
}
