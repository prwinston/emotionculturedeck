"use client";

import { useState, useTransition } from "react";
import { updateFollowupAction } from "@/app/sessions/actions";
import { useToast } from "@/components/ToastProvider";
import type { Session } from "@/lib/supabase/types";

export function FollowupFlag({ sessionId, session }: { sessionId: string; session: Session }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const [needsFollowup, setNeedsFollowup] = useState(session.needs_followup);

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          try {
            await updateFollowupAction(sessionId, formData);
            toast.success("Follow-up updated.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not update follow-up.");
          }
        })
      }
      className="rounded-lg border border-neutral-200 p-4"
    >
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="needs_followup"
          checked={needsFollowup}
          onChange={(e) => setNeedsFollowup(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Needs a follow-up check-in
      </label>

      {needsFollowup && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1" htmlFor="followup_date">
              Check-in date
            </label>
            <input
              id="followup_date"
              name="followup_date"
              type="date"
              defaultValue={session.followup_date ?? ""}
              className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1" htmlFor="followup_note">
              Note
            </label>
            <textarea
              id="followup_note"
              name="followup_note"
              rows={2}
              defaultValue={session.followup_note ?? ""}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              placeholder="What to check on next time"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save follow-up"}
      </button>
    </form>
  );
}
