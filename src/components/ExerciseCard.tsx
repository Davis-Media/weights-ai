import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ExerciseCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Exercise</CardTitle>
        <CardDescription>Sets and Reps</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <h1 className="text-2xl font-bold">Bench Press</h1>
        <div className="flex items-center gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">1</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">2</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">3</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">4</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">5</TableCell>
                <TableCell>10</TableCell>
                <TableCell>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="border-l border-gray-200 h-10" />
          <div className="flex flex-col justify-between">
            <div className="text-sm">Total</div>
            <div className="font-semibold">50</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
