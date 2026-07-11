"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function createPulseItemAction(sessionId: string, formData: FormData) {
  const user = await requireUser();
  const label = String(formData.get("label") ?? "").trim();
  const target_value = Number(formData.get("target_value") ?? 0) || null;
  if (!label) throw new Error("A label is required.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pulse_items")
    .insert({ session_id: sessionId, user_id: user.id, label, target_value })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "pulse_item_added",
    entity_type: "pulse_item",
    entity_id: data?.id ?? null,
    user_id: user.id,
    after_state: { label, target_value },
  });

  revalidatePath(`/sessions/${sessionId}/measure`);
}

export async function updatePulseItemValueAction(sessionId: string, itemId: string, formData: FormData) {
  const user = await requireUser();
  const current_value = Number(formData.get("current_value") ?? 0) || null;

  const supabase = await createClient();
  const { error } = await supabase.from("pulse_items").update({ current_value }).eq("id", itemId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "pulse_item_updated",
    entity_type: "pulse_item",
    entity_id: itemId,
    user_id: user.id,
    after_state: { current_value },
  });

  revalidatePath(`/sessions/${sessionId}/measure`);
}

export async function deletePulseItemAction(sessionId: string, itemId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: before } = await supabase.from("pulse_items").select("*").eq("id", itemId).single();

  const { error } = await supabase.from("pulse_items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);

  await writeAuditLog(supabase, {
    action: "pulse_item_deleted",
    entity_type: "pulse_item",
    entity_id: itemId,
    user_id: user.id,
    before_state: before,
  });

  revalidatePath(`/sessions/${sessionId}/measure`);
}
