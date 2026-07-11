import Link from "next/link";

const TABS = [
  { key: "agenda", label: "Agenda", href: (id: string) => `/sessions/${id}` },
  { key: "debrief", label: "Debrief", href: (id: string) => `/sessions/${id}/debrief` },
  { key: "canvas", label: "Behaviour Canvas", href: (id: string) => `/sessions/${id}/canvas` },
] as const;

export function SessionTabs({ sessionId, active }: { sessionId: string; active: "agenda" | "debrief" | "canvas" }) {
  return (
    <nav className="mt-6 flex gap-4 border-b border-neutral-200 text-sm">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href(sessionId)}
          className={
            tab.key === active
              ? "border-b-2 border-neutral-900 pb-2 font-medium"
              : "pb-2 text-neutral-500 hover:text-neutral-800"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
