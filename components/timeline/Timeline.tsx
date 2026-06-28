import Link from "next/link";
import { getLab, getModel, timelineSorted } from "@/data";
import type { EventKind } from "@/data/types";
import { formatDate } from "@/lib/format";
import { labStyle } from "@/lib/theme";

const KIND_META: Record<EventKind, { label: string; color: string; icon: string }> = {
  launch: { label: "Launch", color: "var(--color-go)", icon: "🚀" },
  update: { label: "Update", color: "var(--color-accent)", icon: "⬆" },
  policy: { label: "Policy", color: "var(--color-warn)", icon: "⚖" },
  restriction: { label: "Restriction", color: "var(--color-stop)", icon: "🔒" },
  suspension: { label: "Suspension", color: "var(--color-stop)", icon: "⛔" },
};

/** A dramatic vertical timeline. Restriction/suspension events glow red. */
export function Timeline() {
  const events = timelineSorted();
  return (
    <ol className="relative ml-3 border-l border-edge">
      {events.map((e) => {
        const kind = KIND_META[e.kind];
        const lab = e.labId ? getLab(e.labId) : undefined;
        const alert = e.kind === "restriction" || e.kind === "suspension";
        return (
          <li
            key={e.id}
            style={e.labId ? labStyle(e.labId) : undefined}
            className="relative mb-7 pl-6"
          >
            <span
              className={`absolute -left-[7px] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-canvas${alert ? " pulse" : ""}`}
              style={{ background: kind.color, color: kind.color }}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <time className="font-mono text-xs text-subtle">{formatDate(e.date)}</time>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  color: kind.color,
                  background: `color-mix(in srgb, ${kind.color} 14%, transparent)`,
                }}
              >
                {kind.icon} {kind.label}
              </span>
              {lab && (
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--lab-accent)" }}
                >
                  {lab.name}
                </span>
              )}
            </div>
            <h3
              className={`mt-1 font-semibold tracking-tight ${alert ? "" : ""}`}
              style={alert ? { color: "var(--color-stop)" } : undefined}
            >
              {e.title}
            </h3>
            <p className="mt-0.5 max-w-2xl text-sm leading-snug text-muted">{e.detail}</p>
            {e.relatedModelIds.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {e.relatedModelIds.map((id) => {
                  const m = getModel(id);
                  if (!m) return null;
                  return (
                    <Link
                      key={id}
                      href={`/models/${id}`}
                      className="rounded-full border border-edge px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-edge-bright hover:text-ink"
                    >
                      {m.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
