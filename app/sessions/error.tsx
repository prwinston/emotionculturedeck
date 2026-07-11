"use client";

export default function SessionsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p className="font-medium">Something went wrong loading sessions.</p>
        <p className="mt-1 text-red-600">{error.message}</p>
        <button
          onClick={reset}
          className="mt-3 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
