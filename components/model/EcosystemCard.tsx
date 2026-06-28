import type { EcosystemEntry } from "@/data/types";
import { StatusDot } from "@/components/kit/StatusDot";
import { Chip } from "@/components/kit/Chip";
import { STATUS_META } from "@/lib/format";

/** A compact tile for non-model ecosystem surfaces (tools, protocols, products). */
export function EcosystemCard({ entry }: { entry: EcosystemEntry }) {
  const meta = STATUS_META[entry.status];
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-edge bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight tracking-tight">{entry.name}</h3>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted" title={meta.blurb}>
          <StatusDot status={entry.status} />
          {meta.label}
        </span>
      </div>
      <Chip color="var(--color-subtle)">{entry.category}</Chip>
      <p className="text-sm leading-snug text-muted">{entry.summary}</p>
      {entry.highlights.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1">
          {entry.highlights.map((h, i) => (
            <li key={i} className="flex gap-1.5 text-xs leading-snug text-subtle">
              <span style={{ color: "var(--lab-accent)" }} aria-hidden>·</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
