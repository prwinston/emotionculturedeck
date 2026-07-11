"use client";

import { useRef, useState } from "react";
import type { Session, Emotion, DebriefEntry } from "@/lib/supabase/types";

function buildRecapText(session: Session, emotions: Emotion[], entries: DebriefEntry[]): string {
  const desired = [...emotions.filter((e) => e.valence === "desired")]
    .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))
    .slice(0, 3);
  const undesired = [...emotions.filter((e) => e.valence === "undesired")]
    .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))
    .slice(0, 3);

  const lines = [
    `Session recap: ${session.title}`,
    session.facilitator_name ? `Facilitated by ${session.facilitator_name}` : null,
    "",
  ];

  if (desired.length || undesired.length) {
    lines.push("Top emotions:");
    if (desired.length) lines.push(`  Desired: ${desired.map((e) => `${e.label} (${e.frequency})`).join(", ")}`);
    if (undesired.length)
      lines.push(`  Undesired: ${undesired.map((e) => `${e.label} (${e.frequency})`).join(", ")}`);
    lines.push("");
  }

  if (entries.length) {
    lines.push("Commitments & experiments:");
    for (const entry of entries) {
      lines.push(`  - ${entry.behavioural_commitment}${entry.experiment ? ` (experiment: ${entry.experiment})` : ""}`);
    }
    lines.push("");
  }

  if (entries.some((e) => e.summary)) {
    lines.push("Summary:");
    for (const entry of entries) {
      if (entry.summary) lines.push(`  ${entry.summary}`);
    }
  }

  return lines.filter((l) => l !== null).join("\n").trim();
}

export function EmailRecapButton({
  session,
  emotions,
  entries,
}: {
  session: Session;
  emotions: Emotion[];
  entries: DebriefEntry[];
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const text = buildRecapText(session, emotions, entries);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      textareaRef.current?.select();
      setStatus("manual");
    }
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <div>
      <button
        onClick={onCopy}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        {status === "copied" ? "Copied!" : status === "manual" ? "Select & copy below" : "Copy Email Recap"}
      </button>
      <textarea
        ref={textareaRef}
        readOnly
        value={text}
        rows={10}
        className="mt-3 w-full whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600"
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
