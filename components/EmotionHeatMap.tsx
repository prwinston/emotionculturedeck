"use client";

import { useRef, useState, useTransition } from "react";
import { createEmotionAction, deleteEmotionAction } from "@/app/sessions/actions";
import type { Emotion } from "@/lib/supabase/types";

function ValenceColumn({
  title,
  emotions,
  sessionId,
  accent,
}: {
  title: string;
  emotions: Emotion[];
  sessionId: string;
  accent: string;
}) {
  const [pending, startTransition] = useTransition();
  const sorted = [...emotions].sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0));
  const max = Math.max(1, ...sorted.map((e) => e.frequency ?? 0));

  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
      {sorted.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">None yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {sorted.map((e) => (
            <li key={e.id} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{e.label}</span>
                  <span className="text-xs text-neutral-400">{e.frequency ?? 0}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-neutral-100">
                  <div
                    className={`h-2 rounded-full ${accent}`}
                    style={{ width: `${((e.frequency ?? 0) / max) * 100}%` }}
                  />
                </div>
              </div>
              <button
                disabled={pending}
                onClick={() => startTransition(() => deleteEmotionAction(sessionId, e.id))}
                className="text-xs text-neutral-400 hover:text-red-600"
                aria-label={`Remove ${e.label}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EmotionHeatMap({ sessionId, emotions }: { sessionId: string; emotions: Emotion[] }) {
  const desired = emotions.filter((e) => e.valence === "desired");
  const undesired = emotions.filter((e) => e.valence === "undesired");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {emotions.length === 0 && (
        <p className="text-sm text-neutral-400">Add emotions to build the heat map.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ValenceColumn title="Desired" emotions={desired} sessionId={sessionId} accent="bg-green-500" />
        <ValenceColumn title="Undesired" emotions={undesired} sessionId={sessionId} accent="bg-red-500" />
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mt-4 w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
        >
          + Add emotion
        </button>
      ) : (
        <form
          ref={formRef}
          action={(formData) =>
            startTransition(async () => {
              await createEmotionAction(sessionId, formData);
              formRef.current?.reset();
              setOpen(false);
            })
          }
          className="mt-4 rounded-lg border border-neutral-300 p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              name="label"
              placeholder="e.g. Overwhelmed"
              required
              className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
            <input
              name="frequency"
              type="number"
              min={1}
              defaultValue={1}
              className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="valence" defaultValue="desired" className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
              <option value="desired">Desired</option>
              <option value="undesired">Undesired</option>
            </select>
            <select name="category" defaultValue="Positive" className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Wildcard">Wildcard</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {pending ? "Adding…" : "Add emotion"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
