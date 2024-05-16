"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, Edit, Pen, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";

export function ManageSchedule() {
  const userScheduleQuery = api.schedule.getUserSchedule.useQuery();

  if (!userScheduleQuery.data) {
    return <div>LOADING...</div>;
  }

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
                    {daysOfWeek[userSch.day]} - {userSch.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-600 text-sm italic">
                      {userSch.exercises} Exercises Set
                    </h4>
                    <EditDay scheduleId={userSch.id} />
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

function EditDay(props: { scheduleId: string }) {
  const { scheduleId } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [dayName, setDayName] = useState("");

  const dayQuery = api.schedule.getUserScheduleDay.useQuery({ scheduleId });

  useEffect(() => {
    if (dayQuery.data) {
      setDayName(dayQuery.data.name);
      setSelectedExercises(
        dayQuery.data.userScheduleEntries.map((se) => {
          return {
            name: se.userExercise.name,
            id: se.userExercise.id,
            order: se.order,
          };
        })
      );
    }
  }, [dayQuery.data]);

  const [selectedExercises, setSelectedExercises] = useState<
    {
      name: string;
      id: string;
      order: number;
    }[]
  >([]);

  const createExerciseMutation = api.exercise.createUserExercise.useMutation({
    onSuccess: (data) => {
      let maxOrder = 0;
      selectedExercises.forEach((selEx) => {
        if (selEx.order > maxOrder) {
          maxOrder = selEx.order;
        }
      });

      setSelectedExercises([
        ...selectedExercises,
        {
          id: data.id,
          name: exerciseSearchQuery,
          order: maxOrder + 1,
        },
      ]);

      setExerciseSearchQuery("");
    },
  });

  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");

  const [searchForExerciseResults, setSearchForExerciseResults] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);

  const searchForExerciseMutation = api.exercise.searchForExercise.useMutation({
    onSuccess: (data) => {
      setSearchForExerciseResults(data);
    },
  });

  const sortedSelectedExercises = useMemo(() => {
    const copy = selectedExercises;

    copy.sort((a, b) => a.order - b.order);

    return copy;
  }, [selectedExercises]);

  const utils = api.useUtils();

  const updateScheduleMutation = api.schedule.updateUserSchedule.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      utils.schedule.getUserSchedule.invalidate();
    },
  });

  if (dayQuery.error) {
    return (
      <div className="flex justify-center items-center">
        <h4 className="text-slate-600 text-sm italic">
          {dayQuery.error.message}
        </h4>
      </div>
    );
  }

  if (!dayQuery.data) {
    return <Button disabled={true}>Loading...</Button>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <Button onClick={() => setIsOpen(true)}>Edit</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit this Day</DialogTitle>
          <DialogDescription>
            Change the exercises that you want to do on this day of the week
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8">
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

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Day Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Push Day"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
            />
          </div>

          <Separator />

          <div className="relative">
            <h2>Create or Add an Exercise</h2>
            <p className="text-neutral-600 text-sm italic">
              Hit search to find the exercise if you have it in your library (I
              know it sucks, but it&apos;s a work in progress we&apos;ll get
              there)
            </p>
            <Input
              placeholder="Bench"
              onChange={(e) => {
                setExerciseSearchQuery(e.target.value);
              }}
              value={exerciseSearchQuery}
            ></Input>

            <div className="absolute mt-2 w-full flex flex-col bg-white rounded-md shadow-md">
              {searchForExerciseResults
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
                        setSearchForExerciseResults([]);
                      }}
                    >
                      ADD: {res.name}
                    </Button>
                  );
                })}
              {exerciseSearchQuery !== "" && (
                <Button
                  variant={"ghost"}
                  className="justify-start"
                  disabled={createExerciseMutation.isPending}
                  onClick={() =>
                    createExerciseMutation.mutate({ name: exerciseSearchQuery })
                  }
                >
                  {createExerciseMutation.isPending
                    ? "Creating..."
                    : `CREATE: ${exerciseSearchQuery}`}
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-16">
          <Button
            onClick={() =>
              searchForExerciseMutation.mutate({
                query: exerciseSearchQuery,
              })
            }
          >
            Search
          </Button>
          <Button
            onClick={() =>
              updateScheduleMutation.mutate({
                name: dayName,
                exercises: selectedExercises.map((se) => ({
                  exerciseId: se.id,
                  order: se.order,
                })),
                scheduleId,
              })
            }
            disabled={updateScheduleMutation.isPending}
          >
            {updateScheduleMutation.isPending ? "Saving..." : "Save"}
          </Button>

          <Button variant={"secondary"} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  const utils = api.useUtils();

  const createScheduleMutation = api.schedule.createUserSchedule.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      utils.schedule.getUserSchedule.invalidate();
    },
  });

  const createExerciseMutation = api.exercise.createUserExercise.useMutation({
    onSuccess: (data) => {
      let maxOrder = 0;
      selectedExercises.forEach((selEx) => {
        if (selEx.order > maxOrder) {
          maxOrder = selEx.order;
        }
      });

      setSelectedExercises([
        ...selectedExercises,
        {
          id: data.id,
          name: exerciseSearchQuery.query,
          order: maxOrder + 1,
        },
      ]);

      setExerciseSearchQuery({ query: "" });
    },
  });

  const [exerciseSearchQuery, setExerciseSearchQuery] = useState({ query: "" });

  const [searchForExerciseResults, setSearchForExerciseResults] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);

  const searchForExerciseMutation = api.exercise.searchForExercise.useMutation({
    onSuccess: (data) => {
      setSearchForExerciseResults(data);
    },
  });

  const sortedSelectedExercises = useMemo(() => {
    const copy = selectedExercises;

    copy.sort((a, b) => a.order - b.order);

    return copy;
  }, [selectedExercises]);

  const [isOpen, setIsOpen] = useState(false);

  const [dayName, setDayName] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
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

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Day Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Push Day"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
            />
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
                setExerciseSearchQuery({ query: e.target.value });
              }}
              value={exerciseSearchQuery.query}
            ></Input>

            {exerciseSearchQuery.query !== "" && (
              <div className="absolute mt-2 w-full flex flex-col bg-white rounded-md shadow-md">
                {searchForExerciseResults
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
                          setExerciseSearchQuery({ query: "" });

                          setSelectedExercises([
                            ...selectedExercises,
                            {
                              id: res.id,
                              name: res.name,
                              order: maxOrder + 1,
                            },
                          ]);
                          setSearchForExerciseResults([]);
                        }}
                      >
                        ADD: {res.name}
                      </Button>
                    );
                  })}
                <Button
                  variant={"ghost"}
                  className="justify-start"
                  disabled={createExerciseMutation.isPending}
                  onClick={() =>
                    createExerciseMutation.mutate({
                      name: exerciseSearchQuery.query,
                    })
                  }
                >
                  {createExerciseMutation.isPending
                    ? "Creating..."
                    : `CREATE: ${exerciseSearchQuery.query}`}
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="pt-16">
          <Button
            onClick={() =>
              searchForExerciseMutation.mutate({
                query: exerciseSearchQuery.query,
              })
            }
          >
            Search
          </Button>
          <Button
            onClick={() => {
              if (selectedDay === null) {
                alert("no day selected!");
                return;
              }
              createScheduleMutation.mutate({
                name: dayName,
                exercises: selectedExercises.map((se) => ({
                  exerciseId: se.id,
                  order: se.order,
                })),
                day: selectedDay,
              });
            }}
            disabled={createScheduleMutation.isPending}
          >
            {createScheduleMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant={"secondary"} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
