"use client";

import { useEffect, useId, useState, useTransition } from "react";

export function ConfirmModal({
  triggerLabel,
  title,
  body,
  confirmLabel,
  onConfirm,
  triggerClassName,
}: {
  triggerLabel: string;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName ?? "rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{body}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await onConfirm();
                    setOpen(false);
                  })
                }
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {pending ? "Working…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
