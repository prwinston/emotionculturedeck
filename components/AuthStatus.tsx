"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthStatus({ email }: { email: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-neutral-500">{email}</span>
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/sessions");
          router.refresh();
        }}
        className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-50"
      >
        Sign out
      </button>
    </div>
  );
}
