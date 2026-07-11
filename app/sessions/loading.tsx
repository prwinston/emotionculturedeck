export default function LoadingSessions() {
  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
      <div className="mt-8 space-y-4 border-t border-neutral-200 pt-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded bg-neutral-100" />
        ))}
      </div>
    </main>
  );
}
