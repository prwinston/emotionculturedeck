import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-6 sm:p-10">
      <Link href="/sessions" className="text-sm text-neutral-500 hover:text-neutral-800">
        ← Back to sessions
      </Link>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
