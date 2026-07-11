"use client";

import { deleteSessionAction } from "@/app/sessions/actions";
import { ConfirmModal } from "./ConfirmModal";

export function DeleteSessionButton({ sessionId, title }: { sessionId: string; title: string }) {
  return (
    <ConfirmModal
      triggerLabel="Delete session"
      title="Delete this session?"
      body={`"${title}" and all of its agenda blocks, emotions, and debrief entries will be permanently removed.`}
      confirmLabel="Delete"
      onConfirm={async () => {
        await deleteSessionAction(sessionId);
      }}
    />
  );
}
