import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import type { Session, PulseItem } from "@/lib/supabase/types";
import { SessionTabs } from "@/components/SessionTabs";
import { PulseItems } from "@/components/PulseItems";
import { FollowupFlag } from "@/components/FollowupFlag";
import { LoginPrompt } from "@/components/LoginPrompt";

export default async function MeasurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  const [{ data: session }, { data: items }] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", id).single<Session>(),
    supabase
      .from("pulse_items")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true })
      .returns<PulseItem[]>(),
  ]);

  if (!session) notFound();

  const isOwner = !!user && session.user_id === user.id;

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href={`/sessions/${id}`} className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to session
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{session.title}</h1>

      <SessionTabs sessionId={id} active="measure" />

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Pulse survey / KPIs</h2>
        <p className="mt-1 text-sm text-neutral-500">Track sustained value with simple metrics over time.</p>
        <div className="mt-4">
          <PulseItems sessionId={id} items={items ?? []} canWrite={!!user} currentUserId={user?.id ?? null} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Follow-up nudge</h2>
        <div className="mt-4">
          {isOwner ? (
            <FollowupFlag sessionId={id} session={session} />
          ) : (
            <LoginPrompt message="Want to flag this session for a follow-up check-in?" />
          )}
        </div>
      </section>
    </main>
  );
}
