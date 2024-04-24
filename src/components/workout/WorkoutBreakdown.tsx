"use client";

import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteSet } from "@/lib/helper/sets";

type WorkoutBreakdownProps = {
  workoutInfo: {
    date: Date;
    id: string;
    name: string;
    profileId: string;
    location: string;
    inProgress: boolean;
    endedAt: Date | null;
    sets: {
      id: string;
      createdAt: Date;
      userExerciseId: string;
      weight: number;
      reps: number;
      workoutId: string;
    }[];
  };
};

export async function WorkoutBreakdown(props: WorkoutBreakdownProps) {
  const { workoutInfo } = props;

  const [sets, setSets] = useState(workoutInfo.sets);

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg text-slate-800 font-bold">{workoutInfo.name}</h2>
        <h4 className="text-slate-600 font-light">
          {workoutInfo.date.toLocaleDateString()} -{" "}
          <span className="italic">{workoutInfo.location}</span>
        </h4>
        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lift</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* goofy but whatever */}
            {sets.map((set, i) => {
              return (
                <TableRow key={set.id}>
                  <TableCell className="font-semibold">
                    {set.userExerciseId}
                  </TableCell>
                  <TableCell>{set.weight}</TableCell>
                  <TableCell>{set.reps}</TableCell>
                  <TableCell>
                    <Button
                      onClick={async () => {
                        // TODO: flashing?
                        await deleteSet(set.id);
                        const copy = sets;

                        copy.splice(i, 1);

                        setSets([...copy]);
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
