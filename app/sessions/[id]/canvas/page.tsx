import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Session, Emotion, DebriefEntry } from "@/lib/supabase/types";
import { SessionTabs } from "@/components/SessionTabs";
import { EmailRecapButton } from "@/components/EmailRecapButton";

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: session }, { data: emotions }, { data: entries }] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", id).single<Session>(),
    supabase.from("emotions").select("*").eq("session_id", id).returns<Emotion[]>(),
    supabase
      .from("debrief_entries")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: false })
      .returns<DebriefEntry[]>(),
  ]);

  if (!session) notFound();

  const sortedEmotions = emotions ?? [];
  const sortedEntries = entries ?? [];

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href={`/sessions/${id}`} className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to session
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{session.title}</h1>

      <SessionTabs sessionId={id} active="canvas" />

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Behaviour Shift Canvas</h2>
        {sortedEntries.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 py-10 text-center">
            <p className="text-sm text-neutral-500">No debrief entries yet.</p>
            <Link
              href={`/sessions/${id}/debrief`}
              className="mt-3 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Capture Debrief
            </Link>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-neutral-600">Emotion</th>
                  <th className="px-4 py-2 text-left font-medium text-neutral-600">Behaviour / Commitment</th>
                  <th className="px-4 py-2 text-left font-medium text-neutral-600">Experiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 align-top text-neutral-700">{entry.emotion_label || "—"}</td>
                    <td className="px-4 py-2 align-top text-neutral-700">{entry.behavioural_commitment}</td>
                    <td className="px-4 py-2 align-top text-neutral-700">{entry.experiment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Email recap</h2>
        <p className="mt-1 text-sm text-neutral-500">Copy-ready summary for stakeholders.</p>
        <div className="mt-4">
          <EmailRecapButton session={session} emotions={sortedEmotions} entries={sortedEntries} />
        </div>
      </section>
    </main>
  );
}
