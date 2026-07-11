"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { generateDebriefSummary } from "@/lib/ai/openai";

export type DebriefFormState = { error: string | null };

export async function createDebriefEntryAction(
  sessionId: string,
  _prevState: DebriefFormState,
  formData: FormData,
): Promise<DebriefFormState> {
  const user = await requireUser();
  const emotion_label = String(formData.get("emotion_label") ?? "").trim();
  const behavioural_commitment = String(formData.get("behavioural_commitment") ?? "").trim();
  const key_quote = String(formData.get("key_quote") ?? "").trim();
  const experiment = String(formData.get("experiment") ?? "").trim();

  if (!behavioural_commitment) {
    return { error: "A behavioural commitment is required." };
  }

  const supabase = await createClient();
  const { data: session } = await supabase.from("sessions").select("title").eq("id", sessionId).single();

  const { data, error } = await supabase
    .from("debrief_entries")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      emotion_label,
      behavioural_commitment,
      key_quote,
      experiment,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not save debrief entry." };
  }

  await writeAuditLog(supabase, {
    action: "debrief_entry_created",
    entity_type: "debrief_entry",
    entity_id: data.id,
    user_id: user.id,
    after_state: { emotion_label, behavioural_commitment, key_quote, experiment },
  });

  try {
    const { summary, confidence } = await generateDebriefSummary({
      sessionTitle: session?.title ?? "Session",
      emotionLabel: emotion_label,
      behaviouralCommitment: behavioural_commitment,
      keyQuote: key_quote,
      experiment,
    });

    await supabase
      .from("debrief_entries")
      .update({
        summary,
        summary_source: "ai",
        summary_confidence: confidence,
        summary_review_status: "unreviewed",
      })
      .eq("id", data.id);

    await writeAuditLog(supabase, {
      action: "debrief_summary_generated",
      entity_type: "debrief_entry",
      entity_id: data.id,
      user_id: user.id,
      after_state: { summary },
    });
  } catch {
    // AI summary is best-effort; the debrief entry itself already saved successfully.
  }

  revalidatePath(`/sessions/${sessionId}/debrief`);
  revalidatePath(`/sessions/${sessionId}/canvas`);
  revalidatePath(`/sessions/${sessionId}`);
  return { error: null };
}

export async function updateDebriefSummaryAction(sessionId: string, entryId: string, formData: FormData) {
  const user = await requireUser();
  const summary = String(formData.get("summary") ?? "").trim();
  const supabase = await createClient();
  const { data: before } = await supabase.from("debrief_entries").select("*").eq("id", entryId).single();

  const { error } = await supabase
    .from("debrief_entries")
    .update({ summary, summary_review_status: "edited" })
    .eq("id", entryId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "debrief_summary_edited",
    entity_type: "debrief_entry",
    entity_id: entryId,
    user_id: user.id,
    before_state: before,
    after_state: { summary },
  });

  revalidatePath(`/sessions/${sessionId}/debrief`);
  revalidatePath(`/sessions/${sessionId}/canvas`);
}

export async function deleteDebriefEntryAction(sessionId: string, entryId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: before } = await supabase.from("debrief_entries").select("*").eq("id", entryId).single();

  const { error } = await supabase.from("debrief_entries").delete().eq("id", entryId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "debrief_entry_deleted",
    entity_type: "debrief_entry",
    entity_id: entryId,
    user_id: user.id,
    before_state: before,
  });

  revalidatePath(`/sessions/${sessionId}/debrief`);
  revalidatePath(`/sessions/${sessionId}/canvas`);
}
