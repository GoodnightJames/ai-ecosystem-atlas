import { getLab } from "@/data";
import type { LabId } from "@/data/types";

/** Per-lab accent CSS variables, applied inline so any subtree can be themed. */
export function labStyle(id: LabId): React.CSSProperties {
  const lab = getLab(id);
  return {
    ["--lab-accent" as string]: lab?.theme.accent ?? "#888",
    ["--lab-accent-2" as string]: lab?.theme.accent2 ?? "#aaa",
  } as React.CSSProperties;
}
