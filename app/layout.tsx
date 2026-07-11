import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emotion Culture Deck",
  description: "Design, run, and debrief Emotional Culture Deck sessions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-4xl items-center px-6 py-3 sm:px-10">
            <Link href="/sessions" className="text-sm font-semibold tracking-tight">
              Emotion Culture Deck
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
