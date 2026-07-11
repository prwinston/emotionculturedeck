"use client";

import { useActionState } from "react";
import { PERSONAS, FORMATS, type Session } from "@/lib/supabase/types";
import type { SessionFormState } from "@/app/sessions/actions";

export function SessionForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: SessionFormState, formData: FormData) => Promise<SessionFormState>;
  initial?: Partial<Session>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Session title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="e.g. Burnout Reset"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="facilitator_name">
          Facilitator name
        </label>
        <input
          id="facilitator_name"
          name="facilitator_name"
          defaultValue={initial?.facilitator_name ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Your name"
        />
        <p className="mt-1 text-xs text-neutral-400">
          No account needed. Avoid entering sensitive personal data in public fields.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="persona">
            Persona
          </label>
          <select
            id="persona"
            name="persona"
            defaultValue={initial?.persona ?? PERSONAS[0]}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {PERSONAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="format">
            Format
          </label>
          <select
            id="format"
            name="format"
            defaultValue={initial?.format ?? FORMATS[0]}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="duration_minutes">
            Duration (minutes)
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={5}
            defaultValue={initial?.duration_minutes ?? 60}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="audience_size">
            Audience size
          </label>
          <input
            id="audience_size"
            name="audience_size"
            type="number"
            min={1}
            defaultValue={initial?.audience_size ?? 8}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="objectives">
          Objectives
        </label>
        <textarea
          id="objectives"
          name="objectives"
          rows={3}
          defaultValue={initial?.objectives ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="e.g. Team feels burned out and disconnected — surface signals and agree one ritual"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
