import type { Provenance } from "@/data/types";
import { formatDate } from "@/lib/format";

const CONF_COLOR: Record<string, string> = {
  verified: "var(--color-go)",
  reported: "var(--color-warn)",
  estimated: "var(--color-mutedstatus)",
};

/**
 * Surfaces the agents-ready provenance: confidence + when it was last verified.
 * This is the hook a future update-agent uses to find stale rows.
 */
export function FreshnessBadge({ provenance }: { provenance: Provenance }) {
  const color = CONF_COLOR[provenance.confidence];
  return (
    <a
      href={provenance.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 text-[11px] text-subtle transition-colors hover:text-muted"
      title={`${provenance.sourceLabel ?? "Source"} · confidence: ${provenance.confidence}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="capitalize">{provenance.confidence}</span>
      <span aria-hidden>·</span>
      <span>verified {formatDate(provenance.lastVerified)}</span>
      <span className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>↗</span>
    </a>
  );
}
