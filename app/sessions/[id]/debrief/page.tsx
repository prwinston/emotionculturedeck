import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Session, DebriefEntry } from "@/lib/supabase/types";
import { DebriefForm } from "@/components/DebriefForm";
import { DebriefEntryCard } from "@/components/DebriefEntryCard";
import { SessionTabs } from "@/components/SessionTabs";

export default async function DebriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: entries }] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", id).single<Session>(),
    supabase
      .from("debrief_entries")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: false })
      .returns<DebriefEntry[]>(),
  ]);

  if (!session) notFound();

  const sortedEntries = entries ?? [];

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href={`/sessions/${id}`} className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to session
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{session.title}</h1>

      <SessionTabs sessionId={id} active="debrief" />

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Capture a debrief entry</h2>
        <div className="mt-4">
          <DebriefForm sessionId={id} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Debrief entries</h2>
        {sortedEntries.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 py-10 text-center">
            <p className="text-sm text-neutral-500">No debrief entries yet.</p>
            <p className="mt-1 text-xs text-neutral-400">Use the form above to capture your first one.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {sortedEntries.map((e) => (
              <DebriefEntryCard key={e.id} sessionId={id} entry={e} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
