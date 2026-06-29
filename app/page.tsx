import Link from "next/link";
import { getLab, getModel } from "@/data";
import type { LabId } from "@/data/types";
import { STATUS_META, formatContext, formatPricing } from "@/lib/format";
import { TASK_ARCHETYPES } from "@/lib/recommend";
import { MiniBars } from "@/components/kit/MiniBars";
import { labStyle } from "@/lib/theme";

// One headline model per lab for the lineup (each lab's flagship). Google's
// flagship is a media model, so its card falls back to highlights (no benchmarks).
const LINEUP: { labId: LabId; modelId: string }[] = [
  { labId: "openai", modelId: "openai-gpt-5-6-sol" },
  { labId: "anthropic", modelId: "anthropic-opus-4-8" },
  { labId: "google", modelId: "google-veo-3-1" },
];

const TONE_VAR: Record<string, string> = {
  go: "var(--color-go)",
  warn: "var(--color-warn)",
  stop: "var(--color-stop)",
  muted: "var(--color-mutedstatus)",
};

// Three archetypes previewed on the dashboard; full set lives on /choose.
const PREVIEW_TASKS = ["agentic-coding", "long-context", "image-stills"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-32 shrink-0 text-subtle">{label}</dt>
      <dd className="min-w-0 text-ink">{children}</dd>
    </div>
  );
}

function LineupCard({ labId, modelId }: { labId: LabId; modelId: string }) {
  const m = getModel(modelId);
  const lab = getLab(labId);
  if (!m || !lab) return null;
  const meta = STATUS_META[m.status];
  const uses = (m.useCases ?? []).slice(0, 3).map((u) => u.title).join(", ");

  return (
    <Link
      href={`/models/${m.id}`}
      style={labStyle(labId)}
      className="group flex flex-col rounded-xl border border-edge bg-surface p-5 transition-colors hover:border-edge-bright"
    >
      {/* header */}
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm font-bold text-canvas"
          style={{ background: "var(--lab-accent)" }}
          aria-hidden
        >
          {lab.name[0]}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-subtle">{lab.name}</p>
          <h3 className="truncate text-sm font-bold tracking-tight text-ink group-hover:underline">
            {m.name}
          </h3>
        </div>
      </div>

      {/* stat rows */}
      <dl className="flex flex-col gap-2">
        <Row label="Status">
          <span style={{ color: TONE_VAR[meta.tone] }}>{meta.label}</span>
        </Row>
        {uses && <Row label="Primary use cases">{uses}</Row>}
        <Row label="Price / 1M tokens">
          {m.pricing ? formatPricing(m.pricing) : "—"}
        </Row>
        <Row label="Context window">
          {m.contextWindow ? `${formatContext(m.contextWindow)} tokens` : "—"}
        </Row>
      </dl>

      {/* benchmarks, or highlights fallback for media models */}
      <div className="mt-4 border-t border-edge pt-3">
        {m.benchmarks && m.benchmarks.length > 0 ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Benchmarks
              </span>
              <span className="rounded-full bg-raised px-1.5 py-0.5 text-[10px] text-subtle">
                {m.provenance.confidence}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {m.benchmarks.slice(0, 3).map((b) => (
                <div key={b.name}>
                  <p className="truncate text-[10px] text-muted" title={b.name}>
                    {b.name}
                  </p>
                  <p className="mb-1 font-mono text-xs text-ink">
                    {b.score}
                    {(b.max ?? 100) === 100 ? "" : `/${b.max}`}
                  </p>
                  <MiniBars score={b.score} max={b.max} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
              Highlights
            </span>
            <ul className="mt-2 flex flex-col gap-1">
              {m.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-snug text-muted">
                  <span style={{ color: "var(--lab-accent)" }} aria-hidden>
                    ▸
                  </span>
                  <span className="min-w-0">{h}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Link>
  );
}

function ChoosePreviewCard({ taskId }: { taskId: string }) {
  const t = TASK_ARCHETYPES.find((a) => a.id === taskId);
  if (!t) return null;
  const top = t.picks[0];
  const alt = t.picks.find((p) => p.rank !== "primary");
  const topModel = top ? getModel(top.modelId) : undefined;
  const altModel = alt ? getModel(alt.modelId) : undefined;

  return (
    <div className="flex flex-col rounded-xl border border-edge bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base" aria-hidden style={{ color: "var(--color-accent)" }}>
          {t.icon}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">{t.label}</h3>
      </div>
      {topModel && top && (
        <div>
          <p className="text-xs text-subtle">Top pick</p>
          <p className="font-semibold text-accent">{topModel.name}</p>
          <p className="mt-1 text-sm leading-snug text-muted">{top.why}</p>
        </div>
      )}
      {altModel && (
        <p className="mt-3 text-xs text-subtle">
          Alternative: <span className="text-muted">{altModel.name}</span>
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Lineup */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          June 2026 AI Model Lineup
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Each lab&rsquo;s flagship at a glance — status, pricing, and how it stacks up.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {LINEUP.map((l) => (
            <LineupCard key={l.modelId} {...l} />
          ))}
        </div>
      </section>

      {/* Help me choose preview */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">Help me choose</h2>
          <Link href="/choose" className="text-sm font-medium text-accent hover:underline">
            All tasks →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {PREVIEW_TASKS.map((id) => (
            <ChoosePreviewCard key={id} taskId={id} />
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs italic text-subtle">
        Benchmark data is a speculative June 2026 snapshot and requires verification.
      </p>
    </div>
  );
}
