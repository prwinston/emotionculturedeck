"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function GenerateQuestionsButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not generate questions.");
          return;
        }
        router.refresh();
      } catch {
        setError("Network error generating questions.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onClick}
        disabled={pending}
        className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
      >
        {pending ? "Generating…" : "✦ Question Alchemist"}
      </button>
      {error && <p className="max-w-xs text-right text-xs text-amber-600">{error}</p>}
    </div>
  );
}
