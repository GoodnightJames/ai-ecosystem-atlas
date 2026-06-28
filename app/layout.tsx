import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav/SiteNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Ecosystem Atlas — June 2026",
  description:
    "An informative, interactive snapshot of the OpenAI, Anthropic, and Google AI model lineups as of late June 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative z-10 flex min-h-dvh flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-edge px-4 py-6 text-center text-xs text-subtle sm:px-6">
            Dated snapshot · late June 2026. Model names &amp; availability shift quickly — treat as a
            point-in-time reference, not a permanent record. Data lives in a single typed source,
            built to be agent-refreshable.
          </footer>
        </div>
      </body>
    </html>
  );
}
