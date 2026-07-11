import type { SupabaseClient } from "@supabase/supabase-js";

export async function writeAuditLog(
  supabase: SupabaseClient,
  entry: {
    action: string;
    entity_type: string;
    entity_id: string | null;
    user_id?: string | null;
    before_state?: unknown;
    after_state?: unknown;
  },
) {
  await supabase.from("audit_logs").insert({
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id,
    user_id: entry.user_id ?? null,
    before_state: entry.before_state ?? null,
    after_state: entry.after_state ?? null,
  });
}
