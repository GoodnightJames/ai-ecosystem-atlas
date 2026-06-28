import Link from "next/link";
import type { Model } from "@/data/types";
import { getLab } from "@/data";
import { StatusDot } from "@/components/kit/StatusDot";
import { Chip } from "@/components/kit/Chip";
import { FreshnessBadge } from "@/components/kit/FreshnessBadge";
import { STATUS_META, formatContext, formatPricing, titleCase } from "@/lib/format";
import { labStyle } from "@/lib/theme";

/** A single model tile. Left accent rail is the lab color. */
export function ModelCard({ model }: { model: Model }) {
  const lab = getLab(model.labId);
  const meta = STATUS_META[model.status];
  const dimmed = model.status === "suspended" || model.status === "deprecated";

  return (
    <Link
      href={`/models/${model.id}`}
      style={labStyle(model.labId)}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-edge bg-surface p-4 transition-all hover:border-edge-bright hover:bg-raised"
    >
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: "var(--lab-accent)" }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div className={dimmed ? "opacity-70" : ""}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold leading-tight tracking-tight">{model.name}</h3>
            {model.flagship && <Chip color="var(--lab-accent)">flagship</Chip>}
          </div>
          <p className="mt-0.5 text-xs text-subtle">
            {lab?.name}
            {model.family ? ` · ${model.family}` : ""}
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium"
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
          title={meta.blurb}
        >
          <StatusDot status={model.status} />
          {meta.label}
        </span>
      </div>

      <p className="text-sm leading-snug text-muted">{model.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Chip>{titleCase(model.tier)}</Chip>
        {model.modalities.slice(0, 3).map((m) => (
          <Chip key={m} color="var(--color-subtle)">
            {m}
          </Chip>
        ))}
        {model.contextWindow ? (
          <Chip color="var(--color-muted)">{formatContext(model.contextWindow)} ctx</Chip>
        ) : null}
        {model.pricing && (model.pricing.inputPerMTok != null || model.pricing.note) ? (
          <Chip color="var(--color-accent-2)">{formatPricing(model.pricing)}</Chip>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-edge pt-2">
        <FreshnessBadge provenance={model.provenance} />
        <span className="text-xs text-subtle opacity-0 transition-opacity group-hover:opacity-100">
          details →
        </span>
      </div>
    </Link>
  );
}
