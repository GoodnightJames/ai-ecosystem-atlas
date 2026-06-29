/**
 * ============================================================================
 *  AI Ecosystem Catalogue — data schema (the regeneration contract)
 * ============================================================================
 *
 * This file is the SINGLE SOURCE OF TRUTH for the shape of the catalogue. Every
 * fact rendered anywhere in the app comes from the typed arrays in data/*.ts —
 * no fact is ever hardcoded inside a component.
 *
 * AGENTS-READY NOTE (for the future "keep it updated" phase):
 *   - Every entry carries a `provenance` block: where the fact came from, how
 *     confident we are, and when it was last verified. An update-agent can scan
 *     for stale `lastVerified` dates, re-fetch `sourceUrl`, and propose edits.
 *   - The enums below are declared as `as const` tuples so they double as runtime
 *     validators AND make the strict TS compiler reject any invalid value an
 *     agent might append.
 *   - IDs are stable and append-only. Cross-references (supersedes / routesTo /
 *     relatedModelIds) point at these IDs, so never renumber an existing entry.
 *
 * Snapshot date: late June 2026. Treat availability as a dated snapshot.
 */

// ── Enums (as-const tuples → union types + runtime arrays) ──────────────────

export const LAB_IDS = ["anthropic", "openai", "google"] as const;
export type LabId = (typeof LAB_IDS)[number];

/** Availability state — drives the traffic-light styling across the app. */
export const STATUSES = [
  "ga", // generally available
  "preview", // public/limited preview, broadly reachable
  "restricted", // gated by government / approved-partner access
  "suspended", // pulled / disabled (e.g. export-control directive)
  "research", // research preview, invite-only, not productized
  "deprecated", // superseded / retired
] as const;
export type Status = (typeof STATUSES)[number];

/** Coarse capability tier — what slot the entry fills in its family. */
export const TIERS = [
  "flagship",
  "balanced",
  "fast",
  "reasoning",
  "domain",
  "image",
  "video",
  "music",
  "voice",
  "open-weight",
  "tool",
  "n-a",
] as const;
export type Tier = (typeof TIERS)[number];

export const MODALITIES = [
  "text",
  "image",
  "video",
  "audio",
  "music",
  "voice",
  "multimodal",
  "code",
] as const;
export type Modality = (typeof MODALITIES)[number];

/** How sure we are about an entry's facts — surfaced as a freshness badge. */
export const CONFIDENCES = ["verified", "reported", "estimated"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

/** What kind of thing this is. Not everything in an "ecosystem" is a model. */
export const KINDS = ["model", "capability", "initiative", "product"] as const;
export type Kind = (typeof KINDS)[number];

export const EVENT_KINDS = [
  "launch",
  "update",
  "restriction",
  "policy",
  "suspension",
] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

// ── Shared blocks ───────────────────────────────────────────────────────────

/** The agents-ready core: where a fact came from and how fresh it is. */
export interface Provenance {
  /** Best available source link. Lab announcement index is fine when no exact URL. */
  sourceUrl: string;
  sourceLabel?: string;
  confidence: Confidence;
  /** ISO date (YYYY-MM-DD) the entry was last checked against its source. */
  lastVerified: string;
  notes?: string;
}

/** Pricing stored structured (never pre-formatted) so it can be sorted/compared. */
export interface Pricing {
  currency: "USD";
  /** Price per 1M input tokens. null = not published / not token-priced. */
  inputPerMTok: number | null;
  /** Price per 1M output tokens. null = not published / not token-priced. */
  outputPerMTok: number | null;
  note?: string;
}

/**
 * A concrete worked example of what the model is good at — the "demonstration"
 * layer. `why` explains the reasoning, not just the what.
 */
export interface UseCase {
  /** Short label, e.g. "Agentic coding", "Bulk outreach copy". */
  title: string;
  /** The scenario in plain terms — ideally grounded in a real workflow. */
  scenario: string;
  /** Why THIS model fits the scenario (capabilities, price, context, etc.). */
  why: string;
}

/**
 * A published evaluation result, stored structured so it can be rendered as a
 * comparison bar and compared across models sharing the same `name`.
 */
export interface Benchmark {
  /** Eval name, e.g. "SWE-bench Verified", "GPQA Diamond". */
  name: string;
  /** The model's score on this eval, in the unit implied by `max`. */
  score: number;
  /** Scale ceiling (default 100 for percentage scores). */
  max?: number;
  /** What the eval measures, one line. */
  blurb?: string;
  sourceUrl?: string;
}

/**
 * Everything needed to actually call the model. The runnable snippet is
 * generated per-lab from these fields (see lib/api-snippet) rather than stored,
 * so it stays consistent and there's one fact per field.
 */
export interface ApiInfo {
  /** The exact model-ID string you pass to the API, e.g. "claude-opus-4-8". */
  modelString: string;
  /** Official SDK package, e.g. "@anthropic-ai/sdk". */
  sdkPackage?: string;
  /** Env var the SDK reads the key from, e.g. "ANTHROPIC_API_KEY". */
  envVar?: string;
  /** REST endpoint the SDK posts to. */
  endpoint?: string;
  /** Link to the lab's API docs. */
  docsUrl: string;
  /** Anything caller-relevant: beta headers, access notes, gotchas. */
  note?: string;
}

// ── Core entities ───────────────────────────────────────────────────────────

export interface Model {
  id: string;
  kind: Kind;
  labId: LabId;
  name: string;
  /** Generation/family label, e.g. "GPT-5.6", "Claude Opus", "Gemini". */
  family?: string;
  tier: Tier;
  status: Status;
  modalities: Modality[];
  /** Context window in tokens. null when not applicable/unknown. */
  contextWindow?: number | null;
  maxOutputTokens?: number | null;
  pricing?: Pricing;
  /** ISO date (YYYY-MM-DD), or a YYYY-MM string when only the month is known. */
  releaseDate: string;
  retiredDate?: string;
  flagship?: boolean;
  summary: string;
  highlights: string[];
  /** "Reach for this when…" — decision guidance, a few short phrases. */
  bestFor?: string[];
  /** "Skip it when…" — where another model is the better call. */
  notIdealFor?: string[];
  /** Concrete worked examples with reasoning (the demonstration layer). */
  useCases?: UseCase[];
  /** Published eval results, rendered as comparison bars. */
  benchmarks?: Benchmark[];
  /** How to actually call it — model-ID string, SDK, snippet inputs, docs. */
  api?: ApiInfo;
  /** Playful naming-theme note (Sol/Terra/Luna, Rosalind, Nano Banana, …). */
  namingTheme?: string;
  /** ID of the model this one supersedes. */
  supersedes?: string;
  /** ID of the model that flagged queries route to (e.g. Fable 5 → Opus 4.8). */
  routesTo?: string;
  provenance: Provenance;
}

/** Tooling / surfaces that aren't standalone models (Claude Code, MCP, Flow…). */
export interface EcosystemEntry {
  id: string;
  kind: Kind;
  labId: LabId;
  name: string;
  category: string;
  status: Status;
  summary: string;
  highlights: string[];
  provenance: Provenance;
}

export interface LabTheme {
  /** Primary accent (hex). */
  accent: string;
  /** Secondary accent for gradients/glows (hex). */
  accent2: string;
}

export interface Lab {
  id: LabId;
  name: string;
  tagline: string;
  blurb: string;
  theme: LabTheme;
  /** The naming-convention story for this lab — fun + informative. */
  namingStory: string;
  funFacts: string[];
  provenance: Provenance;
}

export interface TimelineEvent {
  id: string;
  date: string; // ISO YYYY-MM-DD
  kind: EventKind;
  labId?: LabId;
  title: string;
  detail: string;
  relatedModelIds: string[];
  provenance: Provenance;
}
