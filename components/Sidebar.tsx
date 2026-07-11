"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "@/components/AuthStatus";

const NAV_LINKS = [
  { href: "/sessions", label: "Sessions" },
  { href: "/exercises", label: "Exercise Library" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/sessions") return pathname === "/sessions" || pathname.startsWith("/sessions/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
                : "rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  userEmail,
  onNavigate,
  onClose,
}: {
  userEmail: string | null;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold tracking-tight">Emotion Culture Deck</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-3">
        <Link
          href="/sessions/new"
          onClick={onNavigate}
          className="block rounded-md bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-neutral-700"
        >
          + New Session
        </Link>
      </div>

      <div className="mt-4 flex-1 px-3">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="border-t border-neutral-200 px-5 py-4">
        {userEmail ? (
          <AuthStatus email={userEmail} />
        ) : (
          <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Log in
          </Link>
        )}
      </div>
    </>
  );
}

export function Sidebar({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/sessions" className="text-sm font-semibold tracking-tight">
          Emotion Culture Deck
        </Link>
        {userEmail ? (
          <AuthStatus email={userEmail} />
        ) : (
          <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Log in
          </Link>
        )}
      </div>

      {/* Desktop: always-mounted static rail. No JS-driven positioning at all. */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex"
        aria-label="Sidebar"
      >
        <SidebarBody userEmail={userEmail} />
      </aside>

      {/* Mobile: drawer only exists in the DOM while open, so there's no CSS state to get stuck. */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white lg:hidden"
            aria-label="Sidebar"
          >
            <SidebarBody userEmail={userEmail} onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
