import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SessionForm } from "@/components/SessionForm";
import { updateSessionAction } from "@/app/sessions/actions";
import type { Session } from "@/lib/supabase/types";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.from("sessions").select("*").eq("id", id).single<Session>();

  if (!session) notFound();

  const boundAction = updateSessionAction.bind(null, id);

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href={`/sessions/${id}`} className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to session
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit session</h1>
      <div className="mt-8">
        <SessionForm action={boundAction} initial={session} submitLabel="Save changes" />
      </div>
    </main>
  );
}
