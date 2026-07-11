"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthStatus({ email }: { email: string }) {
  const router = useRouter();

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <span className="min-w-0 max-w-[120px] truncate text-neutral-500 sm:max-w-[200px]" title={email}>
        {email}
      </span>
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/sessions");
          router.refresh();
        }}
        className="shrink-0 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-50"
      >
        Sign out
      </button>
    </div>
  );
}
