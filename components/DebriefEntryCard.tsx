"use client";

import { useState, useTransition } from "react";
import { updateDebriefSummaryAction, deleteDebriefEntryAction } from "@/app/sessions/[id]/debrief/actions";
import { useToast } from "@/components/ToastProvider";
import type { DebriefEntry } from "@/lib/supabase/types";

export function DebriefEntryCard({
  sessionId,
  entry,
  canEdit,
}: {
  sessionId: string;
  entry: DebriefEntry;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {entry.emotion_label && (
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {entry.emotion_label}
            </span>
          )}
          <p className="font-medium">{entry.behavioural_commitment}</p>
        </div>
        {canEdit && (
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await deleteDebriefEntryAction(sessionId, entry.id);
                  toast.success("Debrief entry removed.");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not remove entry.");
                }
              })
            }
            className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>

      {entry.key_quote && <p className="mt-2 text-sm italic text-neutral-600">{entry.key_quote}</p>}
      {entry.experiment && (
        <p className="mt-2 text-sm text-neutral-600">
          <span className="font-medium text-neutral-700">Experiment:</span> {entry.experiment}
        </p>
      )}

      <div className="mt-3 rounded-md bg-neutral-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">AI summary</span>
          {entry.summary_review_status && (
            <span className="text-xs text-neutral-400">{entry.summary_review_status}</span>
          )}
        </div>
        {editing ? (
          <form
            action={(formData) =>
              startTransition(async () => {
                try {
                  await updateDebriefSummaryAction(sessionId, entry.id, formData);
                  toast.success("Summary updated.");
                  setEditing(false);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not save summary.");
                }
              })
            }
            className="mt-2 space-y-2"
          >
            <textarea
              name="summary"
              defaultValue={entry.summary ?? ""}
              rows={3}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-neutral-300 px-3 py-1 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-700">
              {entry.summary ?? "Not generated yet — AI generation isn't configured, or is still processing."}
            </p>
            {canEdit && (
              <button
                onClick={() => setEditing(true)}
                className="mt-2 rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-100"
              >
                Edit summary
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
