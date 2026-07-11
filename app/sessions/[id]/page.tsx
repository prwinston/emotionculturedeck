import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Session, SessionBlock, Emotion } from "@/lib/supabase/types";
import { AgendaBlockCard } from "@/components/AgendaBlockCard";
import { AddBlockForm } from "@/components/AddBlockForm";
import { EmotionHeatMap } from "@/components/EmotionHeatMap";
import { DeleteSessionButton } from "@/components/DeleteSessionButton";
import { GenerateAgendaButton } from "@/components/GenerateAgendaButton";
import { GenerateQuestionsButton } from "@/components/GenerateQuestionsButton";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: blocks }, { data: emotions }] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", id).single<Session>(),
    supabase
      .from("session_blocks")
      .select("*")
      .eq("session_id", id)
      .order("position", { ascending: true })
      .returns<SessionBlock[]>(),
    supabase.from("emotions").select("*").eq("session_id", id).returns<Emotion[]>(),
  ]);

  if (!session) notFound();

  const sortedBlocks = blocks ?? [];
  const sortedEmotions = emotions ?? [];

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href="/sessions" className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to sessions
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{session.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {session.facilitator_name ?? "No facilitator name"} · {session.persona ?? "—"} ·{" "}
            {session.format ?? "—"} · {session.duration_minutes ?? "?"} min · {session.audience_size ?? "?"} people
          </p>
          {session.objectives && <p className="mt-2 max-w-xl text-sm text-neutral-600">{session.objectives}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
            {session.status ?? "draft"}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/sessions/${id}/edit`}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              Edit
            </Link>
            <DeleteSessionButton sessionId={id} title={session.title} />
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Agenda</h2>
          <div className="flex gap-2">
            <GenerateQuestionsButton sessionId={id} />
            <GenerateAgendaButton sessionId={id} />
          </div>
        </div>

        {sortedBlocks.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 py-10 text-center">
            <p className="text-sm text-neutral-500">No agenda blocks yet.</p>
            <p className="mt-1 text-xs text-neutral-400">Generate one with AI or add blocks manually below.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {sortedBlocks.map((b) => (
              <AgendaBlockCard key={b.id} sessionId={id} block={b} />
            ))}
          </div>
        )}

        <div className="mt-3">
          <AddBlockForm sessionId={id} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Emotion heat map</h2>
        <div className="mt-4">
          <EmotionHeatMap sessionId={id} emotions={sortedEmotions} />
        </div>
      </section>
    </main>
  );
}
