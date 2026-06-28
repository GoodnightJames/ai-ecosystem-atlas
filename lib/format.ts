import type { Pricing, Status } from "@/data/types";

/** Human label + descriptor for each availability status. */
export const STATUS_META: Record<
  Status,
  { label: string; tone: "go" | "warn" | "stop" | "muted"; blurb: string }
> = {
  ga: { label: "Generally Available", tone: "go", blurb: "Anyone can use it." },
  preview: { label: "Preview", tone: "warn", blurb: "Limited / early access." },
  restricted: { label: "Restricted", tone: "stop", blurb: "Government-gated to approved partners." },
  suspended: { label: "Suspended", tone: "stop", blurb: "Pulled under a directive." },
  research: { label: "Research Preview", tone: "muted", blurb: "Invite-only, not productized." },
  deprecated: { label: "Deprecated", tone: "muted", blurb: "Superseded / retired." },
};

/** Format a token context window like 1_000_000 → "1M". */
export function formatContext(tokens?: number | null): string {
  if (!tokens) return "—";
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000) return `${tokens / 1_000}K`;
  return String(tokens);
}

/** Format per-MTok pricing as "$5 / $25" (in / out), or a note when not token-priced. */
export function formatPricing(p?: Pricing): string {
  if (!p) return "—";
  if (p.inputPerMTok == null && p.outputPerMTok == null) {
    return p.note ?? "—";
  }
  const fmt = (n: number | null) => (n == null ? "—" : `$${n}`);
  return `${fmt(p.inputPerMTok)} / ${fmt(p.outputPerMTok)}`;
}

/** A YYYY-MM-DD / YYYY-MM / YYYY date → a friendly label. */
export function formatDate(d: string): string {
  const parts = d.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (parts.length === 1) return parts[0];
  const [y, m, day] = parts;
  const mon = months[Number(m) - 1] ?? m;
  return day ? `${mon} ${Number(day)}, ${y}` : `${mon} ${y}`;
}

/** Title-case a kebab/single-word enum value for display. */
export function titleCase(s: string): string {
  return s
    .split(/[-_\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
