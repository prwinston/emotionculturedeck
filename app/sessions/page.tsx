import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/supabase/types";

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Session[]>();

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Design, run, and debrief Emotional Culture Deck sessions.
          </p>
        </div>
        <Link
          href="/sessions/new"
          className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          New Session
        </Link>
      </div>

      {error && (
        <div className="mt-8 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load sessions: {error.message}
        </div>
      )}

      {!error && sessions && sessions.length === 0 && (
        <div className="mt-16 flex flex-col items-center rounded-lg border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-500">No sessions yet.</p>
          <Link
            href="/sessions/new"
            className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Create your first session
          </Link>
        </div>
      )}

      {!error && sessions && sessions.length > 0 && (
        <ul className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/sessions/${s.id}`}
                className="flex items-center justify-between gap-4 py-4 hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {s.persona ?? "—"} · {s.format ?? "—"} · {s.duration_minutes ?? "?"} min ·{" "}
                    {s.audience_size ?? "?"} people
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {s.needs_followup && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Follow-up
                    </span>
                  )}
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                    {s.status ?? "draft"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
