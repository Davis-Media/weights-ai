import AddExerciseCard from "@/components/AddExerciseCard";
import ExerciseCard from "@/components/ExerciseCard";
import { db } from "@/lib/db";

export default async function Home() {
  // testing loading some data
  const users = await db.query.users.findMany();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        {users.map((u) => {
          return (
            <li key={u.id}>
              {u.name} : {u.email}
            </li>
          );
        })}
      </ul>
      <ExerciseCard />
      <AddExerciseCard />
    </main>
  );
}
