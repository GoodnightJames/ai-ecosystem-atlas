import type { Metadata } from "next";
import { Library } from "@/components/plans/Library";

export const metadata: Metadata = {
  title: "Plan library — AI Ecosystem Atlas",
  description: "Saved council build plans, grouped by project.",
};

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plan library</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Saved build plans from the council, grouped by project — reference, compare,
        or hand any of them to your coding agent.
      </p>
      <Library />
    </div>
  );
}
