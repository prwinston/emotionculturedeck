"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export function GenerateAgendaButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/generate-agenda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.code === "auth_required") {
            router.push("/login");
            return;
          }
          setError(data.error ?? "Could not generate agenda.");
          return;
        }
        toast.success(`Generated ${data.count} agenda blocks.`);
        router.refresh();
      } catch {
        setError("Network error generating agenda. You can still add blocks manually.");
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
        {pending ? "Generating…" : "✦ Generate Agenda"}
      </button>
      {error && <p className="max-w-[220px] text-right text-xs text-amber-600 sm:max-w-xs">{error}</p>}
    </div>
  );
}
