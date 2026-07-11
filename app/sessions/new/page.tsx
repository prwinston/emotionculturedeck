import Link from "next/link";
import { SessionForm } from "@/components/SessionForm";
import { createSessionAction } from "@/app/sessions/actions";
import { requireUser } from "@/lib/auth";

export default async function NewSessionPage() {
  await requireUser();

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <Link href="/sessions" className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to sessions
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">New session</h1>
      <p className="mt-1 text-sm text-neutral-500">This session is saved under your account right away.</p>
      <div className="mt-8">
        <SessionForm action={createSessionAction} submitLabel="Create session" />
      </div>
    </main>
  );
}
