import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type OneDayScheduleProps = {
  entry: {
    id: string;
    day: number;
    userScheduleEntries: {
      id: string;
      order: number;
      userExerciseId: string;
      userScheduleId: string;
      userExercise: {
        id: string;
        name: string;
        profileId: string;
      };
    }[];
  };
};

export function OneDaySchedule(props: OneDayScheduleProps) {
  const { entry } = props;

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
    <Card>
      <CardHeader>
        <CardTitle>Schedule for {daysOfWeek[entry.day]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          {entry.userScheduleEntries.map((se) => {
            return (
              <div key={se.id}>
                <h3 className="text-slate-900 font-bold">
                  {se.userExercise.name}
                </h3>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
