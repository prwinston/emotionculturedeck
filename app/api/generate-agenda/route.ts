import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";
import { generateAgendaBlocks, AIConfigError } from "@/lib/ai/openai";
import type { Session } from "@/lib/supabase/types";

export async function POST(request: Request) {
  const { sessionId } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single<Session>();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  try {
    const blocks = await generateAgendaBlocks(session);

    const { count } = await supabase
      .from("session_blocks")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId);

    const rows = blocks.map((b, i) => ({
      session_id: sessionId,
      block_type: b.block_type,
      title: b.title,
      duration_minutes: b.duration_minutes,
      content: b.content,
      position: (count ?? 0) + i + 1,
      content_source: "ai",
      content_confidence: b.confidence,
      content_review_status: "unreviewed",
    }));

    const { error: insertError } = await supabase.from("session_blocks").insert(rows);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      action: "agenda_generated",
      entity_type: "session",
      entity_id: sessionId,
      after_state: { blocks_created: rows.length },
    });

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (err) {
    if (err instanceof AIConfigError) {
      return NextResponse.json({ error: err.message, code: "ai_not_configured" }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Agenda generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
