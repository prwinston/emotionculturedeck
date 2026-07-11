"use client";

import { useRef, useState, useTransition } from "react";
import {
  createPulseItemAction,
  updatePulseItemValueAction,
  deletePulseItemAction,
} from "@/app/sessions/[id]/measure/actions";
import { useToast } from "@/components/ToastProvider";
import { LoginPrompt } from "@/components/LoginPrompt";
import type { PulseItem } from "@/lib/supabase/types";

function PulseItemRow({
  sessionId,
  item,
  canEdit,
}: {
  sessionId: string;
  item: PulseItem;
  canEdit: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const pct =
    item.target_value && item.target_value > 0
      ? Math.min(100, Math.round(((item.current_value ?? 0) / item.target_value) * 100))
      : null;

  return (
    <li className="rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium">{item.label}</p>
          <p className="mt-0.5 text-xs text-neutral-400">
            {item.current_value ?? 0}
            {item.target_value != null ? ` / ${item.target_value}` : ""}
          </p>
          {pct != null && (
            <div className="mt-2 h-2 w-full rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        {canEdit && (
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await deletePulseItemAction(sessionId, item.id);
                  toast.success("Removed.");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not remove.");
                }
              })
            }
            className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>

      {canEdit && (
        <form
          action={(formData) =>
            startTransition(async () => {
              try {
                await updatePulseItemValueAction(sessionId, item.id, formData);
                toast.success("Value updated.");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not update value.");
              }
            })
          }
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <label htmlFor={`current-${item.id}`} className="text-xs text-neutral-500">
            Current value
          </label>
          <input
            id={`current-${item.id}`}
            name="current_value"
            type="number"
            defaultValue={item.current_value ?? ""}
            className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Update
          </button>
        </form>
      )}
    </li>
  );
}

export function PulseItems({
  sessionId,
  items,
  canWrite,
  currentUserId,
}: {
  sessionId: string;
  items: PulseItem[];
  canWrite: boolean;
  currentUserId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">No pulse items yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <PulseItemRow
              key={item.id}
              sessionId={sessionId}
              item={item}
              canEdit={!!currentUserId && item.user_id === currentUserId}
            />
          ))}
        </ul>
      )}

      <div className="mt-4">
        {!canWrite ? (
          <LoginPrompt message="Want to track a pulse metric for this session?" />
        ) : !open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
          >
            + Add pulse item
          </button>
        ) : (
          <form
            ref={formRef}
            action={(formData) =>
              startTransition(async () => {
                try {
                  await createPulseItemAction(sessionId, formData);
                  toast.success("Pulse item added.");
                  formRef.current?.reset();
                  setOpen(false);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not add item.");
                }
              })
            }
            className="rounded-lg border border-neutral-300 p-4 space-y-3"
          >
            <div>
              <label htmlFor="label" className="block text-xs font-medium text-neutral-500 mb-1">
                What are you measuring?
              </label>
              <input
                id="label"
                name="label"
                required
                placeholder="e.g. Psychological safety score"
                className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="target_value" className="block text-xs font-medium text-neutral-500 mb-1">
                Target value (optional)
              </label>
              <input
                id="target_value"
                name="target_value"
                type="number"
                className="w-32 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {pending ? "Adding…" : "Add pulse item"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
