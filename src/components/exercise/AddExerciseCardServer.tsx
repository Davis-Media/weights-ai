import AddExerciseCardClient from "./AddExerciseCardClient";

export async function AddExerciseCardServer(props: {
  initState: {
    exerciseId: string;
    reps: number;
    weight: number;
  }[];
}) {
  const { initState } = props;

  return <AddExerciseCardClient initState={initState} />;
}
