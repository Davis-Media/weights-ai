import AddExerciseCardClient from "./AddExerciseCardClient";

export async function AddExerciseCardServer(props: {
  initState: {
    exercise: string;
    reps: number;
    weight: number;
  }[];
}) {
  const { initState } = props;

  return <AddExerciseCardClient initState={initState} />;
}
