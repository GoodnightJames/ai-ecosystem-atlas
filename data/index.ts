/**
 * Public data API. Components import ONLY from here (and ./types) — never reach
 * into a raw data file. Arrays are deep-frozen so a view can't mutate the source.
 */
import { LABS } from "./labs";
import { MODELS } from "./models";
import { ECOSYSTEM } from "./ecosystem";
import { TIMELINE } from "./timeline";
import type {
  EcosystemEntry,
  Lab,
  LabId,
  Model,
  Status,
  TimelineEvent,
} from "./types";

function deepFreeze<T>(arr: readonly T[]): readonly T[] {
  arr.forEach((item) => {
    if (item && typeof item === "object") Object.freeze(item);
  });
  return Object.freeze(arr);
}

export const labs = deepFreeze(LABS);
export const models = deepFreeze(MODELS);
export const ecosystem = deepFreeze(ECOSYSTEM);
export const timeline = deepFreeze(TIMELINE);

// ── Lookups ────────────────────────────────────────────────────────────────

export const allModels = (): readonly Model[] => models;

export const getLab = (id: LabId): Lab | undefined =>
  labs.find((l) => l.id === id);

export const getModel = (id: string): Model | undefined =>
  models.find((m) => m.id === id);

export const modelsByLab = (id: LabId): Model[] =>
  models.filter((m) => m.labId === id);

export const ecosystemByLab = (id: LabId): EcosystemEntry[] =>
  ecosystem.filter((e) => e.labId === id);

export const modelsByStatus = (status: Status): Model[] =>
  models.filter((m) => m.status === status);

export const timelineSorted = (): TimelineEvent[] =>
  [...timeline].sort((a, b) => a.date.localeCompare(b.date));

/** Display order + labels for the status traffic-light system. */
export const STATUS_ORDER: Status[] = [
  "ga",
  "preview",
  "restricted",
  "suspended",
  "research",
  "deprecated",
];

export * from "./types";
