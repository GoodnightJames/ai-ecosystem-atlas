import type { Metadata } from "next";
import { Timeline } from "@/components/timeline/Timeline";

export const metadata: Metadata = {
  title: "Timeline — AI Ecosystem Atlas",
  description: "2026 launches, updates, and the mid-June restriction arc across the three labs.",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">2026 Timeline</h1>
        <p className="mt-2 text-muted">
          From Haiku 4.5 to the GPT-5.6 preview gating. The red beats mark the fortnight when two of
          three labs locked down their frontier models.
        </p>
      </header>
      <Timeline />
    </div>
  );
}
