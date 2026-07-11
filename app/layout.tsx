import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { AuthStatus } from "@/components/AuthStatus";

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
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3 sm:px-10">
            <Link href="/sessions" className="text-sm font-semibold tracking-tight">
              Emotion Culture Deck
            </Link>
            {user ? (
              <AuthStatus email={user.email ?? ""} />
            ) : (
              <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
                Log in
              </Link>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
