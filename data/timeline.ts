import type { TimelineEvent } from "./types";

/**
 * The 2026 release & restriction timeline. The spine of the story is the
 * mid-June "two of three labs restricted in a fortnight" arc.
 */

const V = "2026-06-28";

export const TIMELINE: readonly TimelineEvent[] = [
  {
    id: "ev-haiku-4-5",
    date: "2025-10-01",
    kind: "launch",
    labId: "anthropic",
    title: "Claude Haiku 4.5 released",
    detail: "Anthropic's fast, low-cost tier ships for high-volume, latency-sensitive work.",
    relatedModelIds: ["anthropic-haiku-4-5"],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-sonnet-4-6",
    date: "2026-01-15",
    kind: "launch",
    labId: "anthropic",
    title: "Claude Sonnet 4.6 released",
    detail: "The balanced mid-tier workhorse arrives — frontier-class at ~40% lower cost than Opus.",
    relatedModelIds: ["anthropic-sonnet-4-6"],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      confidence: "estimated",
      lastVerified: V,
    },
  },
  {
    id: "ev-opus-4-7",
    date: "2026-03-15",
    kind: "launch",
    labId: "anthropic",
    title: "Claude Opus 4.7 released",
    detail: "The autonomous, long-horizon Opus that 4.8 would build on.",
    relatedModelIds: ["anthropic-opus-4-7"],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      confidence: "estimated",
      lastVerified: V,
    },
  },
  {
    id: "ev-rosalind-intro",
    date: "2026-04-01",
    kind: "launch",
    labId: "openai",
    title: "GPT-Rosalind introduced",
    detail: "A frontier reasoning model purpose-built for life sciences, named for Rosalind Franklin.",
    relatedModelIds: ["openai-rosalind"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-privacy-filter",
    date: "2026-04-22",
    kind: "launch",
    labId: "openai",
    title: "OpenAI Privacy Filter (open weights)",
    detail: "An Apache-2.0 PII-redaction model small enough to run in a browser — 1.5B params, 50M active.",
    relatedModelIds: ["openai-privacy-filter"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-gpt-5-5",
    date: "2026-04-23",
    kind: "launch",
    labId: "openai",
    title: "GPT-5.5 released",
    detail: "The smartest widely-available tier — still the generally-available anchor of OpenAI's lineup.",
    relatedModelIds: ["openai-gpt-5-5"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-realtime-voice",
    date: "2026-05-07",
    kind: "launch",
    labId: "openai",
    title: "Realtime Voice models ship",
    detail: "GPT-Realtime-2, -Translate, and -Whisper reason, translate, and transcribe live in conversation.",
    relatedModelIds: ["openai-realtime-2", "openai-realtime-translate", "openai-realtime-whisper"],
    provenance: {
      sourceUrl: "https://platform.openai.com/docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-opus-4-8",
    date: "2026-05-28",
    kind: "launch",
    labId: "anthropic",
    title: "Claude Opus 4.8 released",
    detail:
      "Anthropic's most capable GA model — 1M context, adaptive thinking, 84% Online-Mind2Web, plus Claude Code Dynamic Workflows.",
    relatedModelIds: ["anthropic-opus-4-8"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-rosalind-biodefense",
    date: "2026-05-29",
    kind: "policy",
    labId: "openai",
    title: "Rosalind Biodefense announced",
    detail:
      "A controlled-access initiative layering sponsored GPT-Rosalind access for vetted biodefense & public-health partners.",
    relatedModelIds: ["openai-rosalind-biodefense"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-exec-order",
    date: "2026-06-02",
    kind: "policy",
    title: "US executive order on powerful models",
    detail:
      "An executive order directs federal agencies to set up a pre-release review process for powerful AI models — the regulatory backdrop for the restrictions that follow.",
    relatedModelIds: [],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-rosalind-update",
    date: "2026-06-03",
    kind: "update",
    labId: "openai",
    title: "GPT-Rosalind capabilities update",
    detail: "A major update — ~31% fewer tokens than GPT-5.5 on long quantitative-biology analyses.",
    relatedModelIds: ["openai-rosalind"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-dreaming",
    date: "2026-06-04",
    kind: "launch",
    labId: "openai",
    title: "\"Dreaming\" memory becomes core",
    detail: "ChatGPT's rebuilt memory synthesizes past chats in the background and revises facts over time.",
    relatedModelIds: ["openai-dreaming"],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-fable-mythos-launch",
    date: "2026-06-09",
    kind: "launch",
    labId: "anthropic",
    title: "Claude Fable 5 & Mythos 5 launch",
    detail:
      "The first public Mythos-class model (Fable 5, safeguarded) plus its Glasswing-only twin (Mythos 5, safeguards lifted).",
    relatedModelIds: ["anthropic-fable-5", "anthropic-mythos-5"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-fable-mythos-suspend",
    date: "2026-06-12",
    kind: "suspension",
    labId: "anthropic",
    title: "Fable 5 & Mythos 5 suspended",
    detail:
      "Anthropic disables both models for all customers to comply with a US export-control directive restricting access by foreign nationals. No confirmed restoration date.",
    relatedModelIds: ["anthropic-fable-5", "anthropic-mythos-5"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "ev-gpt-5-6-preview",
    date: "2026-06-26",
    kind: "restriction",
    labId: "openai",
    title: "GPT-5.6 family preview-gated",
    detail:
      "Sol, Terra, and Luna launch as a government-gated limited preview to ~20 approved partners via API & Codex — not ChatGPT, no waitlist.",
    relatedModelIds: ["openai-gpt-5-6-sol", "openai-gpt-5-6-terra", "openai-gpt-5-6-luna"],
    provenance: {
      sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      confidence: "reported",
      lastVerified: V,
    },
  },
];
