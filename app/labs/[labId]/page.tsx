import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ecosystemByLab, getLab, labs, modelsByLab } from "@/data";
import { LAB_IDS, type LabId } from "@/data/types";
import { ModelCard } from "@/components/model/ModelCard";
import { EcosystemCard } from "@/components/model/EcosystemCard";
import { FunFacts } from "@/components/lab/FunFacts";
import { labStyle } from "@/lib/theme";

export function generateStaticParams() {
  return LAB_IDS.map((labId) => ({ labId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ labId: string }>;
}): Promise<Metadata> {
  const { labId } = await params;
  const lab = getLab(labId as LabId);
  return {
    title: lab ? `${lab.name} — AI Ecosystem Atlas` : "Lab — AI Ecosystem Atlas",
    description: lab?.blurb,
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId: rawLabId } = await params;
  const labId = rawLabId as LabId;
  const lab = getLab(labId);
  if (!lab) notFound();

  const models = modelsByLab(labId);
  const eco = ecosystemByLab(labId);

  return (
    <div style={labStyle(labId)} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Lab hero */}
      <header className="relative mb-10 overflow-hidden rounded-xl border border-edge bg-surface p-6 sm:p-8">
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--lab-accent)" }}
          aria-hidden
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            {labs.map((l) => (
              <a
                key={l.id}
                href={`/labs/${l.id}`}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  l.id === labId
                    ? "text-canvas"
                    : "border border-edge text-muted hover:text-ink"
                }`}
                style={l.id === labId ? { background: l.theme.accent } : undefined}
              >
                {l.name}
              </a>
            ))}
          </div>
          <h1
            className="mt-4 text-4xl font-bold tracking-tight"
            style={{ color: "var(--lab-accent)" }}
          >
            {lab.name}
          </h1>
          <p className="mt-1 text-lg text-ink">{lab.tagline}</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{lab.blurb}</p>
        </div>
      </header>

      {/* Fun facts */}
      <section className="mb-10">
        <FunFacts lab={lab} />
      </section>

      {/* Models */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">
          Models <span className="text-sm font-normal text-subtle">({models.length})</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      {eco.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Ecosystem &amp; tooling{" "}
            <span className="text-sm font-normal text-subtle">({eco.length})</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eco.map((e) => (
              <EcosystemCard key={e.id} entry={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
