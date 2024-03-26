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

export default function AddExerciseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise</CardTitle>
        <CardDescription>Enter your exercise details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="exercise">Exercise</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bench">Bench Press</SelectItem>
              <SelectItem value="squat">Squat</SelectItem>
              <SelectItem value="deadlift">Deadlift</SelectItem>
              <SelectItem value="curls">Bicep Curls</SelectItem>
              <SelectItem value="lunges">Lunges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col  md:flex-row items-center gap-4">
          <div className="flex flex-col w-full md:w-1/2">
            <Label htmlFor="reps" className="pb-1">
              Reps
            </Label>
            <Input id="reps" placeholder="Reps" type="number" />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <Label htmlFor="weight" className="pb-1">
              Weight (lbs)
            </Label>
            <Input id="weight" placeholder="Weight" type="number" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save</Button>
      </CardFooter>
    </Card>
  );
}
