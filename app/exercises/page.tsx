import { ExerciseLibrary } from "@/components/ExerciseLibrary";

export default function ExercisesPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <h1 className="text-2xl font-bold tracking-tight">Pick-n-Play Exercise Library</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Filter by duration and energy level to find the right activity for your session.
      </p>
      <div className="mt-8">
        <ExerciseLibrary />
      </div>
    </main>
  );
}
