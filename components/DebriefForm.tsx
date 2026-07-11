"use client";

import { useActionState } from "react";
import { createDebriefEntryAction, type DebriefFormState } from "@/app/sessions/[id]/debrief/actions";

export function DebriefForm({ sessionId }: { sessionId: string }) {
  const boundAction = createDebriefEntryAction.bind(null, sessionId);
  const [state, formAction, pending] = useActionState<DebriefFormState, FormData>(boundAction, { error: null });

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-neutral-200 p-4">
      {state?.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="emotion_label">
          Emotion focus
        </label>
        <input
          id="emotion_label"
          name="emotion_label"
          placeholder="e.g. Overwhelmed"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="behavioural_commitment">
          Behavioural commitment *
        </label>
        <textarea
          id="behavioural_commitment"
          name="behavioural_commitment"
          required
          rows={2}
          placeholder="e.g. No-meeting Fridays for deep work"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="key_quote">
          Key quote
        </label>
        <input
          id="key_quote"
          name="key_quote"
          placeholder={`"I didn't realise others felt the same."`}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="experiment">
          Experiment
        </label>
        <input
          id="experiment"
          name="experiment"
          placeholder="e.g. Trial no-meeting Fridays for 4 weeks"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save debrief entry"}
      </button>
    </form>
  );
}
