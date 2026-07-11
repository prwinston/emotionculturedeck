import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { generateQuestions, AIConfigError } from "@/lib/ai/openai";
import type { Session } from "@/lib/supabase/types";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Log in to generate questions.", code: "auth_required" }, { status: 401 });
  }

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
    const questions = await generateQuestions(session);

    const { count } = await supabase
      .from("session_blocks")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId);

    const rows = questions.map((q, i) => ({
      session_id: sessionId,
      user_id: user.id,
      block_type: "question",
      title: `Situational Question ${i + 1}`,
      duration_minutes: 5,
      content: q.question,
      position: (count ?? 0) + i + 1,
      content_source: "ai",
      content_confidence: q.confidence,
      content_review_status: "unreviewed",
    }));

    const { error: insertError } = await supabase.from("session_blocks").insert(rows);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      action: "questions_generated",
      entity_type: "session",
      entity_id: sessionId,
      user_id: user.id,
      after_state: { questions_created: rows.length },
    });

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (err) {
    if (err instanceof AIConfigError) {
      return NextResponse.json({ error: err.message, code: "ai_not_configured" }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Question generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
