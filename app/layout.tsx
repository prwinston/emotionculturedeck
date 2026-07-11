import type { Metadata } from "next";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { ToastProvider } from "@/components/ToastProvider";
import { Sidebar } from "@/components/Sidebar";

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
          <Sidebar userEmail={user?.email ?? null} />
          <div id="main" className="lg:pl-64">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
