import type { Lab } from "./types";

/**
 * The three labs. Theme accents drive per-lab coloring across the app.
 * `namingStory` + `funFacts` power the "entertaining" callouts.
 */
export const LABS: readonly Lab[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    tagline: "Claude — Opus, Sonnet, Haiku & the Mythos line",
    blurb:
      "Maker of Claude. In 2026 the lineup spans the generally-available Opus/Sonnet/Haiku tiers and the more powerful, safeguard-gated Mythos-class models (Fable 5 / Mythos 5) — the latter pair suspended mid-June under a US export-control directive.",
    theme: { accent: "#cc7a4d", accent2: "#e0a06f" },
    namingStory:
      "Claude tiers are sized like coffee: Opus (biggest), Sonnet (mid), Haiku (fastest). The Mythos-class twins are literary: Fable is the safeguarded, broadly-released variant; Mythos is the unguarded variant, distributed only through the invitation-only Project Glasswing.",
    funFacts: [
      "Fable 5 and Mythos 5 are the SAME underlying model at two safeguard levels — Fable routes flagged high-risk queries to Opus 4.8 instead of answering them.",
      "Opus 4.8 dropped manual thinking budgets entirely: depth is now steered by an 'effort' dial (low → max).",
      "Computer Use on Opus 4.8 scores 84% on Online-Mind2Web — driving a browser like a person.",
    ],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news",
      sourceLabel: "Anthropic news",
      confidence: "reported",
      lastVerified: "2026-06-28",
    },
  },
  {
    id: "openai",
    name: "OpenAI",
    tagline: "GPT-5.6 Sol/Terra/Luna, GPT-5.5, Rosalind & more",
    blurb:
      "Maker of GPT and ChatGPT. June 2026 introduced the GPT-5.6 generation under a new sun/earth/moon tier naming — launched as a government-gated limited preview to ~20 partners. The widely-available anchor remains GPT-5.5.",
    theme: { accent: "#10a37f", accent2: "#3fd0a8" },
    namingStory:
      "GPT-5.6 splits the number (the generation) from durable capability tiers named for the sky: Sol (sun / best), Terra (earth / everyday), Luna (moon / fast). The idea is the tier names persist across future generations.",
    funFacts: [
      "The entire GPT-5.6 family launched as a restricted preview to ~20 approved partners — via API & Codex only, never ChatGPT.",
      "GPT-Rosalind is named for Rosalind Franklin and is purpose-built for life sciences — using ~31% fewer tokens than GPT-5.5 on long quantitative-biology work.",
      "The OpenAI Privacy Filter is open-weight (Apache 2.0) and tiny enough to redact PII in your browser — 1.5B params, only 50M active.",
    ],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "OpenAI news",
      confidence: "reported",
      lastVerified: "2026-06-28",
    },
  },
  {
    id: "google",
    name: "Google",
    tagline: "Gemini, Veo, Imagen, Nano Banana, Lyria & Flow",
    blurb:
      "Google's 2026 story is a creator stack: image (Imagen 4, Nano Banana), video (Veo 3.1, Gemini Omni), music (Lyria 3, MusicFX DJ) — all converging into Flow, the central cinematic studio that absorbed Whisk and ImageFX.",
    theme: { accent: "#4285f4", accent2: "#9b72f2" },
    namingStory:
      "Google leans whimsical-meets-mythic: 'Nano Banana' for the fast Gemini image model (with a 'Pro' quality lane), Lyria for music (the lyre), Veo for video, Imagen for images, and Flow as the connective tissue tying them together.",
    funFacts: [
      "'Nano Banana' = Gemini 2.5 Flash Image (fast lane); 'Nano Banana Pro' = Gemini 3 Pro Image (quality lane, 4K, best-in-class legible multilingual text).",
      "Flow's February 2026 redesign swallowed Whisk and ImageFX — standalone Whisk libraries were deleted after April 30, 2026.",
      "MusicFX DJ is played like an instrument: up to ten prompt layers and live faders for density, brightness, and chaos.",
    ],
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: "2026-06-28",
    },
  },
];
