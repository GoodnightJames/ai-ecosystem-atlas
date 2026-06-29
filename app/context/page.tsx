import type { Metadata } from "next";
import { ContextEditor } from "@/components/context/ContextEditor";

export const metadata: Metadata = {
  title: "Project context — AI Ecosystem Atlas",
  description:
    "Per-project briefs the council plans with — so it builds on your existing brand and code instead of from scratch.",
};

export default function ContextPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Project context</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Give the council a brief per project — brand, stack, what already exists, constraints. When a
        plan&rsquo;s Project matches one of these, the council plans <em>with</em> that context, so it
        extends your real project instead of guessing.
      </p>
      <ContextEditor />
    </div>
  );
}
