"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export type SessionFormState = { error: string | null };

function readSessionFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const facilitator_name = String(formData.get("facilitator_name") ?? "").trim();
  const persona = String(formData.get("persona") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const duration_minutes = Number(formData.get("duration_minutes") ?? 0) || null;
  const audience_size = Number(formData.get("audience_size") ?? 0) || null;
  const objectives = String(formData.get("objectives") ?? "").trim();
  return { title, facilitator_name, persona, format, duration_minutes, audience_size, objectives };
}

export async function createSessionAction(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const user = await requireUser();
  const fields = readSessionFields(formData);
  if (!fields.title) {
    return { error: "Title is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert({ ...fields, status: "draft", user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create session." };
  }

  await writeAuditLog(supabase, {
    action: "session_created",
    entity_type: "session",
    entity_id: data.id,
    user_id: user.id,
    after_state: fields,
  });

  revalidatePath("/sessions");
  redirect(`/sessions/${data.id}`);
}

export async function updateSessionAction(
  sessionId: string,
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const user = await requireUser();
  const fields = readSessionFields(formData);
  if (!fields.title) {
    return { error: "Title is required." };
  }

  const supabase = await createClient();
  const { data: before } = await supabase.from("sessions").select("*").eq("id", sessionId).single();

  const { error } = await supabase.from("sessions").update(fields).eq("id", sessionId);
  if (error) {
    return { error: error.message };
  }

  await writeAuditLog(supabase, {
    action: "session_updated",
    entity_type: "session",
    entity_id: sessionId,
    user_id: user.id,
    before_state: before,
    after_state: fields,
  });

  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  redirect(`/sessions/${sessionId}`);
}

export async function deleteSessionAction(sessionId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: before } = await supabase.from("sessions").select("*").eq("id", sessionId).single();

  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: "session_deleted",
    entity_type: "session",
    entity_id: sessionId,
    user_id: user.id,
    before_state: before,
  });

  revalidatePath("/sessions");
  redirect("/sessions");
}

export async function updateSessionStatusAction(sessionId: string, status: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("sessions").update({ status }).eq("id", sessionId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "session_status_changed",
    entity_type: "session",
    entity_id: sessionId,
    user_id: user.id,
    after_state: { status },
  });

  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/sessions");
}

// ── Session blocks (agenda) ──────────────────────────────────────────────

export async function createBlockAction(sessionId: string, formData: FormData) {
  const user = await requireUser();
  const block_type = String(formData.get("block_type") ?? "exercise");
  const title = String(formData.get("title") ?? "").trim();
  const duration_minutes = Number(formData.get("duration_minutes") ?? 0) || null;
  const content = String(formData.get("content") ?? "").trim();
  if (!title) throw new Error("Block title is required.");

  const supabase = await createClient();
  const { count } = await supabase
    .from("session_blocks")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  const { data, error } = await supabase
    .from("session_blocks")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      block_type,
      title,
      duration_minutes,
      content,
      position: (count ?? 0) + 1,
      content_source: "manual",
      content_confidence: null,
      content_review_status: "approved",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "block_created",
    entity_type: "session_block",
    entity_id: data?.id ?? null,
    user_id: user.id,
    after_state: { title, block_type, duration_minutes },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function updateBlockAction(sessionId: string, blockId: string, formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const duration_minutes = Number(formData.get("duration_minutes") ?? 0) || null;
  const content = String(formData.get("content") ?? "").trim();
  const block_type = String(formData.get("block_type") ?? "exercise");
  if (!title) throw new Error("Block title is required.");

  const supabase = await createClient();
  const { data: before } = await supabase.from("session_blocks").select("*").eq("id", blockId).single();

  const { error } = await supabase
    .from("session_blocks")
    .update({ title, duration_minutes, content, block_type, content_review_status: "edited" })
    .eq("id", blockId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "block_edited",
    entity_type: "session_block",
    entity_id: blockId,
    user_id: user.id,
    before_state: before,
    after_state: { title, duration_minutes, content, block_type },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function approveBlockAction(sessionId: string, blockId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("session_blocks")
    .update({ content_review_status: "approved" })
    .eq("id", blockId);
  if (error) throw new Error(error.message);
  revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteBlockAction(sessionId: string, blockId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: before } = await supabase.from("session_blocks").select("*").eq("id", blockId).single();

  const { error } = await supabase.from("session_blocks").delete().eq("id", blockId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "block_deleted",
    entity_type: "session_block",
    entity_id: blockId,
    user_id: user.id,
    before_state: before,
  });

  revalidatePath(`/sessions/${sessionId}`);
}

// ── Emotions ──────────────────────────────────────────────────────────────

export async function createEmotionAction(sessionId: string, formData: FormData) {
  const user = await requireUser();
  const label = String(formData.get("label") ?? "").trim();
  const category = String(formData.get("category") ?? "Positive");
  const valence = String(formData.get("valence") ?? "desired");
  const frequency = Number(formData.get("frequency") ?? 1) || 1;
  if (!label) throw new Error("Emotion label is required.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("emotions")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      label,
      category,
      valence,
      frequency,
      label_source: "manual",
      label_confidence: null,
      label_review_status: "approved",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "emotion_added",
    entity_type: "emotion",
    entity_id: data?.id ?? null,
    user_id: user.id,
    after_state: { label, category, valence, frequency },
  });

  revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteEmotionAction(sessionId: string, emotionId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: before } = await supabase.from("emotions").select("*").eq("id", emotionId).single();

  const { error } = await supabase.from("emotions").delete().eq("id", emotionId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "emotion_removed",
    entity_type: "emotion",
    entity_id: emotionId,
    user_id: user.id,
    before_state: before,
  });

  revalidatePath(`/sessions/${sessionId}`);
}
