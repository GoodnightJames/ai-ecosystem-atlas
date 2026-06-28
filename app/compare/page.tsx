import type { Metadata } from "next";
import { Explorer } from "@/components/compare/Explorer";

export const metadata: Metadata = {
  title: "Compare — AI Ecosystem Atlas",
  description:
    "Filter, search, and sort every model across OpenAI, Anthropic, and Google — then compare up to four side by side.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cross-Lab Compare</h1>
        <p className="mt-2 max-w-2xl text-muted">
          One normalized view of the whole field. Filter by lab, status, tier, or modality; sort by
          price or release; tick models to line them up side by side.
        </p>
      </header>
      <Explorer />
    </div>
  );
}
