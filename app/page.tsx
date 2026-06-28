import Link from "next/link";
import { labs, allModels, ecosystem } from "@/data";
import { StatusLegend } from "@/components/status/StatusBoard";
import { labStyle } from "@/lib/theme";

export default function HomePage() {
  const modelCount = allModels().length;
  const lockedCount = allModels().filter(
    (m) => m.status === "restricted" || m.status === "suspended",
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <section className="mb-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Dated snapshot · late June 2026
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          The AI Ecosystem Atlas
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          A field guide to what OpenAI, Anthropic, and Google shipped (and locked down) by mid-2026.
          {" "}
          <span className="text-ink">{modelCount} models &amp; capabilities</span>, three labs, one
          dramatic fortnight — explore it by lab, compare across the field, or trace the timeline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Compare all models →
          </Link>
          <Link
            href="/timeline"
            className="rounded-lg border border-edge bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-edge-bright"
          >
            See the timeline
          </Link>
        </div>
      </section>

      {/* The headline story */}
      <section className="mb-12 overflow-hidden rounded-xl border border-edge bg-surface">
        <div
          className="border-l-4 p-5 sm:p-6"
          style={{ borderColor: "var(--color-stop)" }}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: "var(--color-stop)" }}>
            <span className="pulse inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-stop)", color: "var(--color-stop)" }} aria-hidden />
            The Great June 2026 Lockdown
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Following a June 2 executive order,{" "}
            <strong className="text-ink">two of the three major US labs</strong>{" "}
            had frontier models placed under government access restrictions inside a single two-week
            window: Anthropic disabled{" "}
            <strong className="text-ink">Fable&nbsp;5</strong>{" "}and{" "}
            <strong className="text-ink">Mythos&nbsp;5</strong>{" "}on June&nbsp;12, and OpenAI
            preview-gated the entire{" "}
            <strong className="text-ink">GPT-5.6</strong>{" "}family (Sol, Terra, Luna) on
            June&nbsp;26. {lockedCount} entries in this atlas are currently restricted or suspended.
          </p>
          <Link href="/status" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            View the status board →
          </Link>
        </div>
      </section>

      {/* Status legend */}
      <section className="mb-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">
          Availability at a glance
        </h2>
        <StatusLegend />
      </section>

      {/* Labs */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-subtle">
          The three labs
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {labs.map((lab) => {
            const n = allModels().filter((m) => m.labId === lab.id).length;
            const e = ecosystem.filter((x) => x.labId === lab.id).length;
            return (
              <Link
                key={lab.id}
                href={`/labs/${lab.id}`}
                style={labStyle(lab.id)}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-edge bg-surface p-5 transition-all hover:border-edge-bright"
              >
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: "var(--lab-accent)" }}
                  aria-hidden
                />
                <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--lab-accent)" }}>
                  {lab.name}
                </h3>
                <p className="text-sm text-muted">{lab.tagline}</p>
                <p className="mt-auto text-xs text-subtle">
                  {n} models · {e} ecosystem surface{e === 1 ? "" : "s"} →
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
