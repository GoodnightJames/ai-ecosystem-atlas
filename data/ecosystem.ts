import type { EcosystemEntry } from "./types";

/**
 * Ecosystem surfaces & tooling that aren't standalone models — agentic tools,
 * protocols, capability settings, and consumer/workspace products.
 */

const V = "2026-06-28";

export const ECOSYSTEM: readonly EcosystemEntry[] = [
  // ── Anthropic ──
  {
    id: "anthropic-claude-code",
    kind: "product",
    labId: "anthropic",
    name: "Claude Code",
    category: "Agentic coding",
    status: "ga",
    summary:
      "An agentic coding tool that reads a whole codebase, plans and executes cross-file changes, runs tests, and iterates on failures from natural-language prompts.",
    highlights: [
      "Available via CLI, desktop, and mobile",
      "Dynamic Workflows: plans work, spins up many parallel subagents in one session, verifies its own output",
      "Aimed at codebase-scale migrations and large security/remediation passes",
    ],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude Code docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-effort-control",
    kind: "capability",
    labId: "anthropic",
    name: "Effort Control",
    category: "Capability setting",
    status: "ga",
    summary:
      "A dial trading reasoning depth against speed/cost. On Opus 4.8 it defaults to high, spanning low / medium / high / xhigh / max.",
    highlights: [
      "Token allocation recalibrated for 4.8 (medium ↑, high ↓, xhigh ↑) — re-baseline old settings",
      "Now a user-facing control in claude.ai and Cowork",
    ],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "What's new in Opus 4.8",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-computer-use",
    kind: "capability",
    labId: "anthropic",
    name: "Computer Use",
    category: "Capability",
    status: "ga",
    summary:
      "Lets the model act as a browser/computer agent, interacting directly with interfaces. Opus 4.8 is Anthropic's strongest here.",
    highlights: ["84% on Online-Mind2Web — a meaningful jump over Opus 4.7"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      sourceLabel: "Introducing Claude Opus 4.8",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-fast-mode",
    kind: "capability",
    labId: "anthropic",
    name: "Fast Mode",
    category: "Capability (research preview)",
    status: "preview",
    summary:
      "A research-preview option on Opus 4.8 (via the Claude API) delivering up to ~2.5× higher output tokens/sec from the same model at premium pricing.",
    highlights: ["~2.5× output tok/s", "Cheaper than fast mode was on earlier models"],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude API docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-agent-sdk",
    kind: "product",
    labId: "anthropic",
    name: "Claude Agent SDK & Managed Agents",
    category: "Developer platform",
    status: "ga",
    summary:
      "The Agent SDK (credit-pool billing) and Managed Agents platform let developers build and run agents against any available Claude model.",
    highlights: ["Unaffected by the Fable/Mythos suspension (so long as the called model is available)"],
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude Agent SDK docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-mcp",
    kind: "capability",
    labId: "anthropic",
    name: "Model Context Protocol (MCP)",
    category: "Open standard",
    status: "ga",
    summary:
      "Anthropic's open standard for connecting models to external tools and data sources, widely used across the agentic ecosystem.",
    highlights: ["Gives Claude access to apps, files, and services"],
    provenance: {
      sourceUrl: "https://modelcontextprotocol.io",
      sourceLabel: "MCP",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-cowork",
    kind: "product",
    labId: "anthropic",
    name: "Claude Cowork",
    category: "Knowledge-work app",
    status: "ga",
    summary:
      "An agentic knowledge-work desktop app for non-developers — Claude multitasks autonomously on documents, spreadsheets, slides, research, and analysis.",
    highlights: ["Can drive the beta tool agents (Chrome, Excel, PowerPoint, Design)"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news",
      sourceLabel: "Anthropic news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-tool-agents",
    kind: "product",
    labId: "anthropic",
    name: "Claude in Chrome / Excel / PowerPoint / Design",
    category: "Beta agent surfaces",
    status: "preview",
    summary:
      "Beta agent surfaces: Claude in Chrome (browsing), Claude in Excel (spreadsheets), Claude in PowerPoint (slides), and Claude Design (canvas/design tools).",
    highlights: ["Iterated on via chat", "Drivable from Cowork"],
    provenance: {
      sourceUrl: "https://www.anthropic.com/news",
      sourceLabel: "Anthropic news",
      confidence: "reported",
      lastVerified: V,
    },
  },

  // ── OpenAI ──
  {
    id: "openai-dreaming",
    kind: "capability",
    labId: "openai",
    name: "\"Dreaming\" Memory (V3)",
    category: "ChatGPT memory",
    status: "preview",
    summary:
      "A rebuilt ChatGPT memory architecture that synthesizes context from many past conversations in the background — no explicit 'remember this' — and performs temporal revision.",
    highlights: [
      "June 4, 2026; rolled out first to US Plus/Pro, expanding in waves",
      "Temporal revision: rewrites 'going to Singapore in July' → 'went in July 2026' after the trip",
    ],
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "Dreaming: better memory for ChatGPT",
      confidence: "reported",
      lastVerified: V,
    },
  },

  // ── Google ──
  {
    id: "google-flow",
    kind: "product",
    labId: "google",
    name: "Google Flow",
    category: "Central creative hub",
    status: "ga",
    summary:
      "Google Labs' centralised cinematic AI studio and the connective tissue of the creator ecosystem — a multi-input canvas tying together Veo (video), Imagen/Nano Banana (image), and Gemini (direction).",
    highlights: [
      "Feb 25, 2026 redesign folded in Whisk and ImageFX",
      "'Ingredients' system: characters, style, background, lighting as reusable assets",
      "Concept → keyframe → audio-synced video in one workspace",
    ],
    provenance: {
      sourceUrl: "https://labs.google/flow",
      sourceLabel: "Google Flow",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-notebooklm",
    kind: "product",
    labId: "google",
    name: "NotebookLM",
    category: "Research assistant",
    status: "ga",
    summary:
      "An AI research/note-taking assistant grounded in your own materials (docs, PDFs, audio, YouTube). Signature outputs: Audio Overviews (two-person podcast) and Video Overviews.",
    highlights: ["Grounded in your sources, not the open web"],
    provenance: {
      sourceUrl: "https://notebooklm.google",
      sourceLabel: "NotebookLM",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-opal",
    kind: "product",
    labId: "google",
    name: "Google Opal",
    category: "No-code app builder",
    status: "ga",
    summary:
      "A no-code AI app builder from Google Labs that turns plain-English descriptions into functional apps with node-based visual workflows, hosting, and a shareable link.",
    highlights: ["Auto-builds node workflows", "Public shareable link, no coding"],
    provenance: {
      sourceUrl: "https://labs.google",
      sourceLabel: "Google Labs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-ai-studio",
    kind: "product",
    labId: "google",
    name: "Google AI Studio",
    category: "Developer workspace",
    status: "ga",
    summary:
      "A developer workspace and central hub for Google's latest generative models — typically the first place new models surface — and the entry point for the Gemini API.",
    highlights: ["Text, image, audio, video models", "Gemini API entry point"],
    provenance: {
      sourceUrl: "https://aistudio.google.com",
      sourceLabel: "Google AI Studio",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-gems",
    kind: "product",
    labId: "google",
    name: "Gemini Gems",
    category: "Custom assistants",
    status: "ga",
    summary:
      "Customisable AI assistants (comparable to custom GPTs) — supply instructions, upload reference guidelines, and lock in a permanent brand voice for repeatable work.",
    highlights: ["Custom instructions + reference uploads"],
    provenance: {
      sourceUrl: "https://gemini.google.com",
      sourceLabel: "Gemini",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-whisk",
    kind: "product",
    labId: "google",
    name: "Google Whisk",
    category: "Compositing (now inside Flow)",
    status: "deprecated",
    summary:
      "The compositing tool — drag in subject, scene, and style reference images and blend them into one visual. Merged into Flow in Feb 2026; standalone library retired after April 30, 2026.",
    highlights: ["Subject/scene/style blending now lives inside Flow"],
    provenance: {
      sourceUrl: "https://labs.google/flow",
      sourceLabel: "Google Flow",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-dream-track",
    kind: "product",
    labId: "google",
    name: "Dream Track",
    category: "YouTube music",
    status: "ga",
    summary:
      "Lyria-powered music generation built into YouTube for creators making AI-generated tracks. Now available globally.",
    highlights: ["Built into YouTube", "Global availability"],
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
];
