import { getInProgressWorkout } from "@/lib/db/helper";
import { Card } from "./ui/card";

export async function CurrentWorkout() {
  const curWorkout = await getInProgressWorkout();

  return (
    <Card className="fixed top-12 right-12 bg-black text-slate-100 py-2 px-6 rounded-full">
      {curWorkout ? (
        // in progress workout real
        <div className="flex flex-row gap-4 items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg">{curWorkout.name}</h2>
            <h4 className="font-light text-sm text-slate-400">
              {curWorkout.location}
            </h4>
          </div>
        </div>
      ) : (
        <div>NO WORKOUT IN PROGRESS</div>
      )}
    </Card>
  );
}
