import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { AuthStatus } from "@/components/AuthStatus";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Emotion Culture Deck",
  description: "Design, run, and debrief Emotional Culture Deck sessions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <ToastProvider>
          <header className="border-b border-neutral-200">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3 sm:px-10">
              <nav className="flex items-center gap-5" aria-label="Primary">
                <Link href="/sessions" className="text-sm font-semibold tracking-tight">
                  Emotion Culture Deck
                </Link>
                <Link href="/exercises" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Exercise Library
                </Link>
              </nav>
              {user ? (
                <AuthStatus email={user.email ?? ""} />
              ) : (
                <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Log in
                </Link>
              )}
            </div>
          </header>
          <div id="main">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
