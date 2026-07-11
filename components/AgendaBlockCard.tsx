"use client";

import { useState, useTransition } from "react";
import { updateBlockAction, deleteBlockAction, approveBlockAction } from "@/app/sessions/actions";
import { BLOCK_TYPES, type SessionBlock } from "@/lib/supabase/types";

const statusStyles: Record<string, string> = {
  unreviewed: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  edited: "bg-blue-100 text-blue-700",
};

export function AgendaBlockCard({ sessionId, block }: { sessionId: string; block: SessionBlock }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        action={(formData) =>
          startTransition(async () => {
            await updateBlockAction(sessionId, block.id, formData);
            setEditing(false);
          })
        }
        className="rounded-lg border border-neutral-300 p-4 space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <select
            name="block_type"
            defaultValue={block.block_type ?? "exercise"}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
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
            defaultValue={block.duration_minutes ?? 5}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <input
          name="title"
          defaultValue={block.title ?? ""}
          required
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <textarea
          name="content"
          defaultValue={block.content ?? ""}
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            {block.block_type} · {block.duration_minutes ?? "?"} min
          </span>
          <h3 className="font-medium">{block.title}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            statusStyles[block.content_review_status ?? "unreviewed"] ?? "bg-neutral-100 text-neutral-600"
          }`}
        >
          {block.content_review_status ?? "unreviewed"}
        </span>
      </div>
      {block.content && <p className="mt-2 text-sm text-neutral-600">{block.content}</p>}
      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
        <span>
          source: {block.content_source ?? "manual"}
          {block.content_confidence != null ? ` · confidence ${block.content_confidence}` : ""}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-medium hover:bg-neutral-50"
        >
          Edit
        </button>
        {block.content_review_status === "unreviewed" && (
          <button
            disabled={pending}
            onClick={() => startTransition(() => approveBlockAction(sessionId, block.id))}
            className="rounded-md border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
          >
            Approve
          </button>
        )}
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteBlockAction(sessionId, block.id))}
          className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
