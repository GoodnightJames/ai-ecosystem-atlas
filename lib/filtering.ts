import type { LabId, Model, Modality, Status, Tier } from "@/data/types";

/** Filter state for the cross-lab explorer. Empty arrays = "no filter". */
export interface FilterState {
  labs: LabId[];
  statuses: Status[];
  tiers: Tier[];
  modalities: Modality[];
  query: string;
}

export const EMPTY_FILTERS: FilterState = {
  labs: [],
  statuses: [],
  tiers: [],
  modalities: [],
  query: "",
};

export type SortKey =
  | "name"
  | "lab"
  | "release-newest"
  | "release-oldest"
  | "price-low"
  | "price-high";

/** Pure: does a single model pass the active filters? */
export function matchesFilters(m: Model, f: FilterState): boolean {
  if (f.labs.length && !f.labs.includes(m.labId)) return false;
  if (f.statuses.length && !f.statuses.includes(m.status)) return false;
  if (f.tiers.length && !f.tiers.includes(m.tier)) return false;
  if (f.modalities.length && !m.modalities.some((x) => f.modalities.includes(x)))
    return false;
  return true;
}

/** Pure: free-text search across name, family, summary, highlights. */
export function searchModels(list: readonly Model[], query: string): Model[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...list];
  return list.filter((m) => {
    const hay = [m.name, m.family ?? "", m.summary, ...m.highlights]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

/** Numeric sort key for input price; null pricing sinks to the bottom. */
function inputPrice(m: Model): number {
  const p = m.pricing?.inputPerMTok;
  return p == null ? Number.POSITIVE_INFINITY : p;
}

/** Pure: sort a list by the given key (returns a new array). */
export function sortModels(list: readonly Model[], key: SortKey): Model[] {
  const out = [...list];
  switch (key) {
    case "name":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "lab":
      return out.sort(
        (a, b) => a.labId.localeCompare(b.labId) || a.name.localeCompare(b.name),
      );
    case "release-newest":
      return out.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    case "release-oldest":
      return out.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
    case "price-low":
      return out.sort((a, b) => inputPrice(a) - inputPrice(b));
    case "price-high":
      return out.sort((a, b) => {
        const pa = a.pricing?.inputPerMTok ?? -1;
        const pb = b.pricing?.inputPerMTok ?? -1;
        return pb - pa;
      });
    default:
      return out;
  }
}

/** Compose filter → search → sort in one pass. */
export function applyFilters(
  list: readonly Model[],
  f: FilterState,
  sort: SortKey,
): Model[] {
  const filtered = list.filter((m) => matchesFilters(m, f));
  const searched = searchModels(filtered, f.query);
  return sortModels(searched, sort);
}
