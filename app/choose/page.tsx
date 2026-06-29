import type { Metadata } from "next";
import { getLab, getModel } from "@/data";
import { STATUS_META, formatPricing } from "@/lib/format";
import { TASK_ARCHETYPES } from "@/lib/recommend";
import {
  Chooser,
  type ResolvedArchetype,
  type ResolvedPick,
} from "@/components/choose/Chooser";

export const metadata: Metadata = {
  title: "Help me choose — AI Ecosystem Atlas",
  description:
    "Pick what you're trying to do and get a recommended model — with the reasoning — organised around how you actually use AI.",
};

export default function ChoosePage() {
  // Resolve curation (recommend.ts) against the catalogue facts (data/models.ts)
  // server-side, so the client component only handles selection + rendering.
  const tasks: ResolvedArchetype[] = TASK_ARCHETYPES.map((t) => ({
    id: t.id,
    icon: t.icon,
    label: t.label,
    blurb: t.blurb,
    picks: t.picks
      .map((p): ResolvedPick | null => {
        const m = getModel(p.modelId);
        if (!m) return null;
        const lab = getLab(m.labId);
        const meta = STATUS_META[m.status];
        return {
          modelId: m.id,
          rank: p.rank,
          why: p.why,
          name: m.name,
          labName: lab?.name ?? m.labId,
          labId: m.labId,
          status: m.status,
          statusLabel: meta.label,
          tone: meta.tone,
          price: m.pricing
            ? `${formatPricing(m.pricing)} per 1M tok`
            : "pricing varies",
          accent: lab?.theme.accent ?? "#888",
        };
      })
      .filter((p): p is ResolvedPick => p !== null),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Help me choose</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
        Pick what you&rsquo;re trying to do and get a recommended model — with the
        reasoning — organised around the ways you actually use AI.
      </p>
      <Chooser tasks={tasks} />
    </div>
  );
}
