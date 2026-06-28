import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allModels, getLab, getModel } from "@/data";
import { StatusDot } from "@/components/kit/StatusDot";
import { Chip } from "@/components/kit/Chip";
import { FreshnessBadge } from "@/components/kit/FreshnessBadge";
import {
  STATUS_META,
  formatContext,
  formatDate,
  formatPricing,
  titleCase,
} from "@/lib/format";
import { labStyle } from "@/lib/theme";

export function generateStaticParams() {
  return allModels().map((m) => ({ modelId: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelId: string }>;
}): Promise<Metadata> {
  const { modelId } = await params;
  const m = getModel(modelId);
  return {
    title: m ? `${m.name} — AI Ecosystem Atlas` : "Model — AI Ecosystem Atlas",
    description: m?.summary,
  };
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-edge bg-surface px-3 py-2.5">
      <dt className="text-[11px] uppercase tracking-wide text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const model = getModel(modelId);
  if (!model) notFound();

  const lab = getLab(model.labId);
  const meta = STATUS_META[model.status];
  const routesTo = model.routesTo ? getModel(model.routesTo) : undefined;
  const supersedes = model.supersedes ? getModel(model.supersedes) : undefined;

  return (
    <div style={labStyle(model.labId)} className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href={`/labs/${model.labId}`} className="text-sm text-muted hover:text-ink">
        ← {lab?.name}
      </Link>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
          {model.flagship && <Chip color="var(--lab-accent)">flagship</Chip>}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              color:
                meta.tone === "go"
                  ? "var(--color-go)"
                  : meta.tone === "warn"
                    ? "var(--color-warn)"
                    : meta.tone === "stop"
                      ? "var(--color-stop)"
                      : "var(--color-mutedstatus)",
              background: "color-mix(in srgb, currentColor 12%, transparent)",
            }}
          >
            <StatusDot status={model.status} />
            {meta.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-subtle">
          {lab?.name}
          {model.family ? ` · ${model.family}` : ""} · {titleCase(model.kind)}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">{model.summary}</p>
      </header>

      {/* Specs */}
      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Spec label="Tier" value={titleCase(model.tier)} />
        <Spec label="Status" value={meta.label} />
        <Spec label="Released" value={formatDate(model.releaseDate)} />
        {model.contextWindow ? (
          <Spec label="Context" value={`${formatContext(model.contextWindow)} tokens`} />
        ) : null}
        {model.maxOutputTokens ? (
          <Spec label="Max output" value={`${formatContext(model.maxOutputTokens)} tokens`} />
        ) : null}
        {model.pricing ? (
          <Spec label="Price (in / out per 1M)" value={formatPricing(model.pricing)} />
        ) : null}
        {model.retiredDate ? (
          <Spec label="Suspended / retired" value={formatDate(model.retiredDate)} />
        ) : null}
      </dl>

      {/* Modalities */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {model.modalities.map((m) => (
          <Chip key={m} color="var(--color-subtle)">
            {m}
          </Chip>
        ))}
      </div>

      {/* Highlights */}
      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-subtle">Highlights</h2>
        <ul className="flex flex-col gap-2">
          {model.highlights.map((h, i) => (
            <li key={i} className="flex gap-2 text-sm leading-snug text-muted">
              <span style={{ color: "var(--lab-accent)" }} aria-hidden>▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Naming + relationships */}
      {(model.namingTheme || routesTo || supersedes) && (
        <section className="mt-8 flex flex-col gap-2">
          {model.namingTheme && (
            <div className="rounded-lg border border-edge bg-surface p-3 text-sm text-muted">
              <span className="mr-1" aria-hidden>✦</span>
              {model.namingTheme}
            </div>
          )}
          {routesTo && (
            <p className="text-sm text-muted">
              Flagged high-risk queries route to{" "}
              <Link href={`/models/${routesTo.id}`} className="text-accent hover:underline">
                {routesTo.name}
              </Link>
              .
            </p>
          )}
          {supersedes && (
            <p className="text-sm text-muted">
              Supersedes{" "}
              <Link href={`/models/${supersedes.id}`} className="text-accent hover:underline">
                {supersedes.name}
              </Link>
              .
            </p>
          )}
        </section>
      )}

      {/* Provenance */}
      <footer className="mt-8 border-t border-edge pt-4">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-subtle">Source &amp; freshness</p>
        <FreshnessBadge provenance={model.provenance} />
        {model.provenance.notes && (
          <p className="mt-1 text-xs text-subtle">{model.provenance.notes}</p>
        )}
      </footer>
    </div>
  );
}
