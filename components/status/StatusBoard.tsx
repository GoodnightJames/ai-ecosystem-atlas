import { allModels, STATUS_ORDER } from "@/data";
import type { Status } from "@/data/types";
import { STATUS_META } from "@/lib/format";
import { ModelCard } from "@/components/model/ModelCard";
import { StatusDot } from "@/components/kit/StatusDot";

const TONE_COLOR: Record<string, string> = {
  go: "var(--color-go)",
  warn: "var(--color-warn)",
  stop: "var(--color-stop)",
  muted: "var(--color-mutedstatus)",
};

/** Count of models in each status — drives the legend tiles. */
function counts() {
  const map = new Map<Status, number>();
  for (const m of allModels()) map.set(m.status, (map.get(m.status) ?? 0) + 1);
  return map;
}

/** Compact legend row of status counts (used on the home hero). */
export function StatusLegend() {
  const c = counts();
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((s) => {
        const meta = STATUS_META[s];
        const n = c.get(s) ?? 0;
        if (!n) return null;
        return (
          <div
            key={s}
            className="flex items-center gap-2 rounded-md border border-edge bg-surface px-3 py-1.5 text-sm"
            style={{ color: TONE_COLOR[meta.tone] }}
            title={meta.blurb}
          >
            <StatusDot status={s} />
            <span className="font-semibold tabular-nums">{n}</span>
            <span className="text-muted">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Full board: every model grouped under its status, in severity order. */
export function StatusBoard() {
  const c = counts();
  return (
    <div className="flex flex-col gap-10">
      {STATUS_ORDER.map((s) => {
        const group = allModels().filter((m) => m.status === s);
        if (!group.length) return null;
        const meta = STATUS_META[s];
        return (
          <section key={s}>
            <div className="mb-3 flex items-center gap-3">
              <h2
                className="flex items-center gap-2 text-lg font-semibold"
                style={{ color: TONE_COLOR[meta.tone] }}
              >
                <StatusDot status={s} size={11} />
                {meta.label}
                <span className="text-sm font-normal text-subtle tabular-nums">
                  ({c.get(s) ?? 0})
                </span>
              </h2>
              <span className="text-sm text-muted">{meta.blurb}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((m) => (
                <ModelCard key={m.id} model={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
