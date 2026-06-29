import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allModels, getLab, getModel } from "@/data";
import { StatusDot } from "@/components/kit/StatusDot";
import { Chip } from "@/components/kit/Chip";
import { CodeBlock } from "@/components/kit/CodeBlock";
import { FreshnessBadge } from "@/components/kit/FreshnessBadge";
import {
  STATUS_META,
  formatContext,
  formatDate,
  formatPricing,
  titleCase,
} from "@/lib/format";
import { buildSnippet } from "@/lib/api-snippet";
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">
      {children}
    </h2>
  );
}

/** A labelled fill bar for a benchmark score, relative to its scale ceiling. */
function BenchmarkBar({
  name,
  score,
  max = 100,
  blurb,
}: {
  name: string;
  score: number;
  max?: number;
  blurb?: string;
}) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{name}</span>
        <span className="font-mono text-sm text-muted">
          {score}
          {max === 100 ? "%" : ` / ${max}`}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-raised">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: "var(--lab-accent)" }}
        />
      </div>
      {blurb && <p className="mt-1 text-xs text-subtle">{blurb}</p>}
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
  // Chat-shaped snippet only makes sense for text/code models — for media
  // models we still show the model-ID + endpoint + docs, just no snippet.
  const isChatLike =
    model.modalities.includes("text") || model.modalities.includes("code");
  const snippet = model.api && isChatLike ? buildSnippet(model.labId, model.api) : null;

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

      {/* Best for / Not ideal for */}
      {(model.bestFor || model.notIdealFor) && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {model.bestFor && (
            <div className="rounded-lg border border-edge bg-surface p-4">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
                <span style={{ color: "var(--color-go)" }} aria-hidden>
                  ✓
                </span>
                Reach for this when
              </h2>
              <ul className="flex flex-col gap-1.5">
                {model.bestFor.map((b, i) => (
                  <li key={i} className="text-sm leading-snug text-muted">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {model.notIdealFor && (
            <div className="rounded-lg border border-edge bg-surface p-4">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
                <span style={{ color: "var(--color-stop)" }} aria-hidden>
                  ✕
                </span>
                Skip it when
              </h2>
              <ul className="flex flex-col gap-1.5">
                {model.notIdealFor.map((b, i) => (
                  <li key={i} className="text-sm leading-snug text-muted">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* How to call it */}
      {model.api && (
        <section className="mt-8">
          <SectionTitle>How to call it</SectionTitle>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <Chip color="var(--lab-accent)" title="The exact model-ID string">
              <span className="font-mono">{model.api.modelString}</span>
            </Chip>
            {model.api.endpoint && (
              <span className="font-mono text-xs text-subtle">{model.api.endpoint}</span>
            )}
          </div>
          {snippet && snippet.install && (
            <div className="mb-2">
              <CodeBlock label="install" code={snippet.install} />
            </div>
          )}
          {snippet && <CodeBlock label={snippet.language} code={snippet.code} />}
          {model.api.note && (
            <p className="mt-2 text-xs leading-relaxed text-subtle">{model.api.note}</p>
          )}
          <a
            href={model.api.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-accent hover:underline"
          >
            API docs ↗
          </a>
        </section>
      )}

      {/* Benchmarks */}
      {model.benchmarks && model.benchmarks.length > 0 && (
        <section className="mt-8">
          <SectionTitle>Benchmarks</SectionTitle>
          <div className="flex flex-col gap-4">
            {model.benchmarks.map((b) => (
              <BenchmarkBar key={b.name} {...b} />
            ))}
          </div>
        </section>
      )}

      {/* Where it fits — use cases */}
      {model.useCases && model.useCases.length > 0 && (
        <section className="mt-8">
          <SectionTitle>Where it fits</SectionTitle>
          <div className="flex flex-col gap-3">
            {model.useCases.map((u) => (
              <div key={u.title} className="rounded-lg border border-edge bg-surface p-4">
                <h3 className="text-sm font-semibold text-ink">{u.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{u.scenario}</p>
                <p className="mt-2 text-sm leading-snug text-subtle">
                  <span style={{ color: "var(--lab-accent)" }}>Why — </span>
                  {u.why}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="mt-8">
        <SectionTitle>Highlights</SectionTitle>
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
