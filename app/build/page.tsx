import type { Metadata } from "next";
import { CouncilForm } from "@/components/build/CouncilForm";

export const metadata: Metadata = {
  title: "Plan a build — AI Ecosystem Atlas",
  description:
    "Describe a project; a council of models proposes how to build it, then synthesizes one recommended plan.",
};

export default function BuildPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plan a build</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Describe a project or idea. A council of current models each proposes how
        they&rsquo;d build it, then Claude synthesizes the strongest single plan —
        and flags where they disagree.
      </p>
      <CouncilForm />
    </div>
  );
}
