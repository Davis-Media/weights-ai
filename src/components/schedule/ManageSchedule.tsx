"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pen, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import {
  createUserExercise,
  createUserSchedule,
  getUserSchedule,
  searchForExercise,
} from "@/lib/helper/schedule";

export function ManageSchedule() {
  const userScheduleQuery = useQuery({
    queryKey: ["user_schedule"],
    queryFn: async () => {
      const res = await getUserSchedule();

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    initialData: [],
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="font-bold text-lg text-slate-800">Manage Schedule</h2>
        <h4 className="font-light text-slate-500">
          Setup a Workout for Each Day of the Week
        </h4>
        <div className="pt-8">
          {userScheduleQuery.data.map((userSch) => {
            const daysOfWeek = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            return (
              <div key={userSch.id}>
                <div className="flex justify-between items-center">
                  <h3 className="text-slate-800 font-bold text-lg">
                    {daysOfWeek[userSch.day]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-600 text-sm italic">
                      {userSch.exercises} Exercises Set
                    </h4>
                    <Button className="flex gap-2">
                      <Pen className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <CreateNewDay
          takenDays={userScheduleQuery.data.map((usq) => usq.day)}
        />
      </CardContent>
    </Card>
  );
}

function CreateNewDay(props: { takenDays: number[] }) {
  const { takenDays } = props;

  const [selectedExercises, setSelectedExercises] = useState<
    {
      name: string;
      id: string;
      order: number;
    }[]
  >([]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const createScheduleMutation = useMutation({
    mutationKey: ["create_schedule"],
    mutationFn: async () => {
      console.log(selectedDay);
      if (selectedDay === null) {
        throw new Error("no day selected!");
      }

      const res = await createUserSchedule({
        day: selectedDay,
        exercises: selectedExercises.map((selEx) => ({
          exerciseId: selEx.id,
          order: selEx.order,
        })),
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      setIsOpen(false);

      queryClient.invalidateQueries({ queryKey: ["user_schedule"] });
    },
  });

  const createExerciseMutation = useMutation({
    mutationKey: ["create_exercise"],
    mutationFn: async (name: string) => {
      const res = await createUserExercise(name);

      if (!res.success) {
        throw new Error(res.message);
      }

      setExerciseSearchQuery("");

      let maxOrder = 0;
      selectedExercises.forEach((selEx) => {
        if (selEx.order > maxOrder) {
          maxOrder = selEx.order;
        }
      });

      setSelectedExercises([
        ...selectedExercises,
        {
          id: res.data,
          name,
          order: maxOrder + 1,
        },
      ]);
    },
  });

  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");

  const searchForExerciseQuery = useQuery({
    queryKey: ["search_for_exercise", exerciseSearchQuery],
    queryFn: async () => {
      const res = await searchForExercise(exerciseSearchQuery);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    initialData: [],
  });

  const sortedSelectedExercises = useMemo(() => {
    const copy = selectedExercises;

    copy.sort((a, b) => a.order - b.order);

    return copy;
  }, [selectedExercises]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen}>
      <Button onClick={() => setIsOpen(true)}>Add Day</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Day of the Week</DialogTitle>
          <DialogDescription>
            Select the Day of the week, then add as many exercises as you would
            like!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div>
            <Label>Select Day</Label>
            <ToggleGroup type="single">
              <ToggleGroupItem
                value="0"
                disabled={(() => takenDays.includes(0))()}
                onClick={() => {
                  setSelectedDay(0);
                }}
              >
                Sun
              </ToggleGroupItem>
              <ToggleGroupItem
                value="1"
                disabled={(() => takenDays.includes(1))()}
                onClick={() => setSelectedDay(1)}
              >
                Mon
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                disabled={(() => takenDays.includes(2))()}
                onClick={() => setSelectedDay(2)}
              >
                Tue
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3"
                disabled={(() => takenDays.includes(3))()}
                onClick={() => setSelectedDay(3)}
              >
                Wed
              </ToggleGroupItem>
              <ToggleGroupItem
                value="4"
                disabled={(() => takenDays.includes(4))()}
                onClick={() => setSelectedDay(4)}
              >
                Thu
              </ToggleGroupItem>
              <ToggleGroupItem
                value="5"
                disabled={(() => takenDays.includes(5))()}
                onClick={() => setSelectedDay(5)}
              >
                Fri
              </ToggleGroupItem>
              <ToggleGroupItem
                value="6"
                disabled={(() => takenDays.includes(6))()}
                onClick={() => setSelectedDay(6)}
              >
                Sat
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Separator />

          <div className="flex flex-col">
            <h2>Current Exercises</h2>
            {sortedSelectedExercises.map((ex, i) => {
              return (
                <div
                  key={ex.id}
                  className={`flex justify-between py-2 px-3 rounded-md items-center ${
                    i % 2 === 0 && "bg-slate-300"
                  }`}
                >
                  <h3 className="text-slate-900 font-bold">{ex.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      className="p-1"
                      onClick={() => {
                        const copy = selectedExercises;

                        if (i === 0) {
                          // flip first and last items
                          const lastOrder = copy[copy.length - 1].order;
                          copy[copy.length - 1].order = copy[0].order;
                          copy[0].order = lastOrder;
                        } else {
                          const aboveOrder = copy[i - 1].order;
                          copy[i - 1].order = copy[i].order;
                          copy[i].order = aboveOrder;
                        }

                        setSelectedExercises([...copy]);
                      }}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      className="p-1"
                      onClick={() => {
                        const copy = selectedExercises;

                        if (i === selectedExercises.length - 1) {
                          // flip first and last items
                          const lastOrder = copy[copy.length - 1].order;
                          copy[copy.length - 1].order = copy[0].order;
                          copy[0].order = lastOrder;
                        } else {
                          const belowOrder = copy[i + 1].order;
                          copy[i + 1].order = copy[i].order;
                          copy[i].order = belowOrder;
                        }

                        setSelectedExercises([...copy]);
                      }}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      className="p-1 bg-red-600"
                      onClick={() => {
                        const copy = selectedExercises;

                        copy.splice(i, 1);

                        setSelectedExercises([...copy]);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="relative">
            <h2>Create or Add an Exercise</h2>
            <Input
              placeholder="Bench"
              onChange={(e) => {
                setExerciseSearchQuery(e.target.value);
              }}
              value={exerciseSearchQuery}
            ></Input>

            {exerciseSearchQuery !== "" && (
              <div className="absolute mt-2 w-full flex flex-col bg-white rounded-md shadow-md">
                {searchForExerciseQuery.data
                  .filter(
                    (v) =>
                      0 >
                      selectedExercises.findIndex((findV) => v.id === findV.id)
                  )
                  .map((res) => {
                    return (
                      <Button
                        key={res.id}
                        variant={"ghost"}
                        className="justify-start"
                        onClick={() => {
                          let maxOrder = 0;
                          selectedExercises.forEach((selEx) => {
                            if (selEx.order > maxOrder) {
                              maxOrder = selEx.order;
                            }
                          });
                          setExerciseSearchQuery("");
                          setSelectedExercises([
                            ...selectedExercises,
                            {
                              id: res.id,
                              name: res.name,
                              order: maxOrder + 1,
                            },
                          ]);
                        }}
                      >
                        ADD: {res.name}
                      </Button>
                    );
                  })}
                <Button
                  variant={"ghost"}
                  className="justify-start"
                  onClick={() =>
                    createExerciseMutation.mutate(exerciseSearchQuery)
                  }
                >
                  CREATE: {exerciseSearchQuery}
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => createScheduleMutation.mutate()}>Save</Button>
          <Button variant={"secondary"}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
