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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useUIState } from "ai/rsc";
import { AI } from "@/app/action";
import { SystemMessage } from "../Messages";
import { createWorkout } from "@/lib/helper/workout";

export default function CreateWorkoutCard() {
  // TODO: make state cleaner, idc right now
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [inProgress, setInProgress] = useState(false);
  const [_, setMessages] = useUIState<typeof AI>();
  const router = useRouter();

  const submit = async () => {
    const res = await createWorkout({ name, location, date, inProgress });

    setMessages([
      {
        id: new Date().getMilliseconds(),
        display: (
          <SystemMessage needsSep={true} message="Created new workout!" />
        ),
      },
    ]);
    router.refresh();

    console.log("workout created! id:", res.nId);
  };

  return (
    <Card key="1">
      <CardHeader>
        <CardTitle>Create New Workout</CardTitle>
        <CardDescription>
          Enter the details of your new workout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="flex items-center space-x-4">
            <Label className="text-base" htmlFor="in-progress">
              In Progress
            </Label>
            <Checkbox
              id="in-progress"
              checked={inProgress}
              onCheckedChange={(checked) => setInProgress(!!checked)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={submit}>
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}

function DatePicker(props: { date: Date; setDate: (date: Date) => void }) {
  const { date, setDate } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(data) => {
            if (data) {
              setDate(data);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
