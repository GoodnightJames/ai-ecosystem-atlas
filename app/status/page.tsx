import type { Metadata } from "next";
import { StatusBoard, StatusLegend } from "@/components/status/StatusBoard";

export const metadata: Metadata = {
  title: "Status Board — AI Ecosystem Atlas",
  description: "Every model grouped by availability: GA, preview, restricted, suspended.",
};

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Status Board</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Traffic lights for the whole field. Green is generally available; amber is preview; red is
          government-gated or suspended; grey is research-only or retired. Red dots pulse.
        </p>
        <div className="mt-4">
          <StatusLegend />
        </div>
      </header>
      <StatusBoard />
    </div>
  );
}
