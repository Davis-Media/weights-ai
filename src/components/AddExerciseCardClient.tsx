"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus, Copy } from "lucide-react";
import { useState } from "react";
import { saveNewSets } from "@/lib/db/helper";
import { Separator } from "./ui/separator";

export default function AddExerciseCardClient(props: {
  initState: {
    exercise: string;
    reps: number;
    weight: number;
  }[];
}) {
  const { initState } = props;
  const [createState, setCreateState] = useState<
    {
      exercise: string;
      reps: number;
      weight: number;
    }[]
  >(
    initState.length > 0
      ? initState
      : [
          {
            exercise: "deadlift",
            weight: 0,
            reps: 0,
          },
        ]
  );
  const [hasSaved, setHasSaved] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise(s)</CardTitle>
        <CardDescription>Enter your exercise details.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {createState.map((item, i) => (
          <div className="grid md:grid-cols-12 gap-2 grid-cols-8" key={i}>
            <div className="flex flex-col space-y-1.5 col-span-4" key={i}>
              <Label htmlFor="exercise">Exercise</Label>
              <Select
                value={item.exercise}
                disabled={hasSaved}
                onValueChange={(v) => {
                  const copy = createState;
                  copy[i].exercise = v;
                  setCreateState([...copy]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bench">Bench Press</SelectItem>
                  <SelectItem value="squat">Squat</SelectItem>
                  <SelectItem value="deadlift">Deadlift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full col-span-3">
              <Label htmlFor="reps" className="pb-1">
                Reps
              </Label>
              <Input
                id="reps"
                placeholder="Reps"
                disabled={hasSaved}
                type="number"
                value={item.reps}
                onChange={(e) => {
                  const copy = createState;
                  const nValue = parseInt(e.target.value);
                  copy[i].reps = isNaN(nValue) ? 0 : nValue;
                  setCreateState([...copy]);
                }}
              />
            </div>
            <div className="flex flex-col w-full col-span-3">
              <Label htmlFor="weight" className="pb-1">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                disabled={hasSaved}
                placeholder="Weight"
                type="number"
                value={item.weight}
                onChange={(e) => {
                  const copy = createState;
                  const nValue = parseInt(e.target.value);
                  copy[i].weight = isNaN(nValue) ? 0 : nValue;
                  setCreateState([...copy]);
                }}
              />
            </div>
            <div className="col-span-2 flex flex-row items-center gap-2">
              <Button
                className="text-white bg-red-600 p-2 rounded-lg w-10 h-10"
                type="button"
                disabled={hasSaved}
                onClick={(e) => {
                  e.preventDefault();

                  const copy = createState;
                  copy.splice(i, 1);
                  setCreateState([...copy]);
                }}
              >
                <CircleMinus className="w-4 h-4" />
              </Button>
              <Button
                className="text-white bg-blue-600 p-2 rounded-lg w-10 h-10"
                type="button"
                disabled={hasSaved}
                onClick={(e) => {
                  e.preventDefault();

                  // fetch backend to save

                  setCreateState([...createState, item]);

                  // catch any errors, if it fails, roll back state update
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                className="text-white bg-green-600 p-2 rounded-lg w-10 h-10"
                type="button"
                disabled={hasSaved}
                onClick={(e) => {
                  e.preventDefault();

                  setCreateState([
                    ...createState,
                    {
                      exercise: "bench",
                      weight: 225,
                      reps: 5,
                    },
                  ]);
                }}
              >
                <CirclePlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          type="button"
          disabled={hasSaved}
          onClick={async (e) => {
            e.preventDefault();

            if (!hasSaved) {
              await saveNewSets(createState);

              setHasSaved(true);
            }
          }}
        >
          {hasSaved ? "New Sets Saved" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
