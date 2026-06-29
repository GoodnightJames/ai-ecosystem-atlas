/**
 * The "Help me choose" decision data — organised around the ways James actually
 * uses AI across his projects, not generic categories.
 *
 * This is CURATION (which model fits which task), kept as data so the page
 * renders the facts (name, price, status) from data/models.ts at display time.
 * `modelId`s are stable references into the catalogue; if a referenced model
 * doesn't resolve, the pick is skipped at render rather than crashing.
 */

export type Rank = "primary" | "budget" | "alt";

export interface Pick {
  modelId: string;
  rank: Rank;
  /** Why this model for this task — one or two sentences. */
  why: string;
}

export interface TaskArchetype {
  id: string;
  /** Emoji glyph for the selector. */
  icon: string;
  label: string;
  /** One line on what this task covers. */
  blurb: string;
  picks: Pick[];
}

export const RANK_LABEL: Record<Rank, string> = {
  primary: "Top pick",
  budget: "Cheaper",
  alt: "Alternative",
};

export const TASK_ARCHETYPES: TaskArchetype[] = [
  {
    id: "agentic-coding",
    icon: "⌘",
    label: "Agentic coding",
    blurb: "Building & maintaining your Next / Tailwind / Sanity apps — let it edit, run tests, verify.",
    picks: [
      {
        modelId: "anthropic-opus-4-8",
        rank: "primary",
        why: "Top-tier SWE-bench and long-horizon coherence with 1M context — the engine behind Claude Code, and the safe default for the hard edits.",
      },
      {
        modelId: "anthropic-sonnet-4-6",
        rank: "budget",
        why: "Frontier-class coding at ~40% lower cost — the right default for the bulk of well-scoped tasks that don't need the flagship.",
      },
      {
        modelId: "openai-gpt-5-5",
        rank: "alt",
        why: "If you want a non-Anthropic agent on the GA path; GPT-5.6 is stronger but currently restricted-access.",
      },
    ],
  },
  {
    id: "autonomous-loops",
    icon: "∞",
    label: "Autonomous build loops",
    blurb: "Overnight 'build → self-check → iterate' harnesses (windbar-style) that run unattended.",
    picks: [
      {
        modelId: "anthropic-opus-4-8",
        rank: "primary",
        why: "Long-horizon autonomous execution is its headline strength — give the full goal up front and run at effort 'xhigh'.",
      },
      {
        modelId: "anthropic-sonnet-4-6",
        rank: "budget",
        why: "When a loop is mostly mechanical, the cheaper tier keeps a long unattended run economical.",
      },
    ],
  },
  {
    id: "long-context",
    icon: "▭",
    label: "Long-context / whole-repo",
    blurb: "Drop in an entire codebase, transcript, or location DB and ask cross-cutting questions.",
    picks: [
      {
        modelId: "anthropic-opus-4-8",
        rank: "primary",
        why: "1M tokens at standard pricing — no long-context premium — so you don't chunk or pre-summarise.",
      },
      {
        modelId: "anthropic-sonnet-4-6",
        rank: "budget",
        why: "Also 1M context at a lower price when the questions aren't the hardest reasoning.",
      },
    ],
  },
  {
    id: "hard-reasoning",
    icon: "✦",
    label: "Hard reasoning",
    blurb: "Gnarly architecture calls, subtle bugs, dense analysis where correctness beats cost.",
    picks: [
      {
        modelId: "anthropic-opus-4-8",
        rank: "primary",
        why: "The most capable generally-available model — set effort to 'high'/'xhigh' and let it deliberate.",
      },
      {
        modelId: "openai-gpt-5-5-pro",
        rank: "alt",
        why: "OpenAI's top-end GA reasoning tier for a second opinion (Fable 5 was stronger but is suspended).",
      },
    ],
  },
  {
    id: "drafting",
    icon: "✎",
    label: "Drafting & outreach copy",
    blurb: "Catalogue-first vendor messages and copy that must hold a specific register.",
    picks: [
      {
        modelId: "anthropic-sonnet-4-6",
        rank: "primary",
        why: "Strong instruction-following holds the voice across volume, at a price that suits high-throughput drafting.",
      },
      {
        modelId: "anthropic-opus-4-8",
        rank: "alt",
        why: "When the register is subtle and the message really matters, the flagship's warmer, less-hedged writing earns its cost.",
      },
    ],
  },
  {
    id: "cheap-bulk",
    icon: "≣",
    label: "Cheap, high-volume jobs",
    blurb: "Tagging, routing, extraction, and fan-out steps where speed and price win.",
    picks: [
      {
        modelId: "anthropic-haiku-4-5",
        rank: "primary",
        why: "Lowest latency and cost in the Claude lineup — ideal for a high-volume first pass that escalates only the hard cases.",
      },
      {
        modelId: "openai-gpt-5-5-instant",
        rank: "alt",
        why: "Auto-routing chat default if you're already in the OpenAI stack.",
      },
    ],
  },
  {
    id: "image-stills",
    icon: "❖",
    label: "Photoreal stills",
    blurb: "High-fidelity marketing / location images generated from a written brief.",
    picks: [
      {
        modelId: "google-imagen-4",
        rank: "primary",
        why: "Flagship text-to-image realism; reach for the Ultra tier when the still has to hold up at full size.",
      },
      {
        modelId: "openai-chatgpt-images-2",
        rank: "alt",
        why: "Strong alternative, especially when the image needs legible in-image text.",
      },
    ],
  },
  {
    id: "image-edit",
    icon: "✂",
    label: "Image edits & fixes",
    blurb: "Cleanup, swaps, restoration, and fast iteration on an existing photo.",
    picks: [
      {
        modelId: "google-nano-banana",
        rank: "primary",
        why: "The fast, cheap lane for quick edits and photo restoration with good character consistency.",
      },
      {
        modelId: "google-nano-banana-pro",
        rank: "alt",
        why: "Step up for 4K output, studio lighting control, or designs with legible text.",
      },
    ],
  },
  {
    id: "design-text",
    icon: "▤",
    label: "Designs with real text",
    blurb: "Posters, menus, bilingual Thai/English signage where the type must be correct.",
    picks: [
      {
        modelId: "google-nano-banana-pro",
        rank: "primary",
        why: "Best-in-class legible multilingual text rendering, up to 4K — print-ready, not just a comp.",
      },
      {
        modelId: "openai-chatgpt-images-2",
        rank: "alt",
        why: "Also strong on in-image text and multilingual captions.",
      },
    ],
  },
  {
    id: "video",
    icon: "►",
    label: "Promo video",
    blurb: "Short hero clips for venue reels and landing pages — with sound.",
    picks: [
      {
        modelId: "google-veo-3-1",
        rank: "primary",
        why: "Native synchronised audio and believable physics in one generation — the keeper-quality tier.",
      },
      {
        modelId: "google-veo-3-1-lite",
        rank: "budget",
        why: "Cheap, fast iteration — explore framing and motion here, then re-render the winner on full Veo 3.1.",
      },
      {
        modelId: "google-gemini-omni",
        rank: "alt",
        why: "When you need to edit or restyle existing footage by conversation rather than generate from scratch.",
      },
    ],
  },
  {
    id: "music",
    icon: "♪",
    label: "Background music",
    blurb: "Original tracks for promo video and reels, no licensing headache.",
    picks: [
      {
        modelId: "google-lyria-3",
        rank: "primary",
        why: "Text-to-music straight to a finished, watermarked track; the Pro variant does full ~3-minute songs.",
      },
      {
        modelId: "google-musicfx-dj",
        rank: "alt",
        why: "For live, hands-on jamming you steer in real time rather than a fixed deliverable.",
      },
    ],
  },
  {
    id: "voice",
    icon: "❮❯",
    label: "Voice & realtime",
    blurb: "Live voice agents, transcription, and on-the-fly translation.",
    picks: [
      {
        modelId: "openai-realtime-2",
        rank: "primary",
        why: "Reasons and calls tools mid-conversation over the Realtime API — e.g. a spoken booking line.",
      },
      {
        modelId: "openai-realtime-translate",
        rank: "alt",
        why: "Live speech-to-speech translation across many languages for serving international guests.",
      },
    ],
  },
];
