import type { Status } from "@/data/types";
import { STATUS_META } from "@/lib/format";

const TONE_COLOR: Record<string, string> = {
  go: "var(--color-go)",
  warn: "var(--color-warn)",
  stop: "var(--color-stop)",
  muted: "var(--color-mutedstatus)",
};

/** A small traffic-light dot. Restricted/suspended pulse to draw the eye. */
export function StatusDot({ status, size = 9 }: { status: Status; size?: number }) {
  const meta = STATUS_META[status];
  const color = TONE_COLOR[meta.tone];
  const isAlert = status === "restricted" || status === "suspended";
  return (
    <span
      className={`inline-block shrink-0 rounded-full${isAlert ? " pulse" : ""}`}
      style={{ width: size, height: size, background: color, color }}
      aria-hidden
    />
  );
}

/** Dot + label, e.g. for legends and headers. */
export function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <StatusDot status={status} />
      {meta.label}
    </span>
  );
}
