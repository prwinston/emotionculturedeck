"use client";

import { useRef, useState, useTransition } from "react";
import { createBlockAction } from "@/app/sessions/actions";
import { BLOCK_TYPES } from "@/lib/supabase/types";

export function AddBlockForm({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
      >
        + Add agenda block manually
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) =>
        startTransition(async () => {
          await createBlockAction(sessionId, formData);
          formRef.current?.reset();
          setOpen(false);
        })
      }
      className="rounded-lg border border-neutral-300 p-4 space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <select name="block_type" defaultValue="exercise" className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          name="duration_minutes"
          type="number"
          min={1}
          defaultValue={10}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>
      <input
        name="title"
        placeholder="Block title"
        required
        className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
      />
      <textarea
        name="content"
        placeholder="Facilitator notes / instructions"
        rows={2}
        className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add block"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
