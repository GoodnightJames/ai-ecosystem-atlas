import type { Model } from "./types";

/**
 * Every model (and a couple of model-shaped "initiatives") across the three labs,
 * late-June-2026 snapshot. IDs are `<lab>-<slug>` and are append-only.
 *
 * Pricing is per 1M tokens, USD. `null` means not token-priced or not published.
 * Where a precise source URL isn't in hand, confidence is "reported" and the link
 * points at the lab's announcement index (see provenance).
 */

const V = "2026-06-28"; // lastVerified for this snapshot

export const MODELS: readonly Model[] = [
  // ───────────────────────────── ANTHROPIC ─────────────────────────────
  {
    id: "anthropic-opus-4-8",
    kind: "model",
    labId: "anthropic",
    name: "Claude Opus 4.8",
    family: "Claude Opus",
    tier: "flagship",
    status: "ga",
    flagship: true,
    modalities: ["text", "code", "multimodal"],
    contextWindow: 1_000_000,
    maxOutputTokens: 128_000,
    pricing: { currency: "USD", inputPerMTok: 5, outputPerMTok: 25 },
    releaseDate: "2026-05",
    summary:
      "Anthropic's most capable generally-available model — built for complex coding, multi-step reasoning, and long-horizon agentic work.",
    highlights: [
      "1M-token context at standard pricing; 128k max output",
      "Adaptive thinking — reasons only when the task needs it (no manual thinking budgets)",
      "Better honesty/self-calibration and tool triggering vs 4.7",
      "Strongest Computer Use model: 84% on Online-Mind2Web",
    ],
    bestFor: [
      "Agentic coding & long refactors — the engine behind Claude Code",
      "Long-horizon autonomous runs that must finish without babysitting",
      "Whole-repo / long-document work (1M context, no long-context premium)",
      "Hard reasoning where correctness matters more than cost",
    ],
    notIdealFor: [
      "High-volume, latency-sensitive, or cheap bulk jobs → Haiku 4.5 / Sonnet 4.6",
      "Trivial classification or extraction a smaller model handles for less",
    ],
    useCases: [
      {
        title: "Agentic coding",
        scenario:
          "Hand it a feature spec or a bug in a Next 16 / Tailwind 4 / Sanity app and let it edit files, run the tests, and verify across the repo in one go.",
        why: "Top-tier SWE-bench plus long-horizon coherence and 1M context means it can hold a whole app in mind; adaptive thinking spends effort only on the hard parts.",
      },
      {
        title: "Autonomous build loops",
        scenario:
          "Overnight 'build → self-check → iterate' harnesses (windbar-style) that run unattended and decide what to do next on their own.",
        why: "Long-horizon execution is its headline strength. Give the full goal up front and run at effort 'xhigh' — higher effort often cuts total turns and cost.",
      },
      {
        title: "Long-context understanding",
        scenario:
          "Drop an entire codebase, a long transcript, or a 50-venue location database in and ask cross-cutting questions.",
        why: "1M tokens at standard pricing — no premium for going long — so you don't have to chunk or pre-summarise first.",
      },
      {
        title: "Nuanced drafting",
        scenario:
          "Catalogue-first vendor outreach that has to hold a specific register (polite Thai, the right honorifics, no over-selling).",
        why: "Warmer, less-hedged writing and strong instruction-following keep a defined voice consistent across many messages.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 80.5,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      },
      {
        name: "GPQA Diamond",
        score: 88,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      },
      {
        name: "Online-Mind2Web",
        score: 84,
        blurb: "Computer-use: completing real tasks across live websites.",
        sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      },
    ],
    api: {
      modelString: "claude-opus-4-8",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Adaptive thinking only — no budget_tokens. For hard agentic work set output_config.effort to 'high' or 'xhigh', and stream when max_tokens is large.",
    },
    supersedes: "anthropic-opus-4-7",
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
      sourceLabel: "Introducing Claude Opus 4.8",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-opus-4-7",
    kind: "model",
    labId: "anthropic",
    name: "Claude Opus 4.7",
    family: "Claude Opus",
    tier: "reasoning",
    status: "ga",
    modalities: ["text", "code", "multimodal"],
    contextWindow: 1_000_000,
    maxOutputTokens: 128_000,
    pricing: { currency: "USD", inputPerMTok: 5, outputPerMTok: 25 },
    releaseDate: "2026-03",
    summary:
      "The prior-generation Opus that 4.8 builds on. Highly autonomous on long-horizon agentic work, knowledge work, vision, and memory.",
    highlights: [
      "Same core API surface as 4.8 (adaptive thinking only)",
      "Remains available for anyone pinned to it",
    ],
    bestFor: [
      "Pinned agentic pipelines that were validated against 4.7 and shouldn't move mid-flight",
      "Long-horizon coding and knowledge work when 4.8's edge isn't worth a re-test",
      "Reproducible runs where a stable, unchanging model version matters",
    ],
    notIdealFor: [
      "New work that wants the best honesty, tool triggering, and Computer Use → Opus 4.8",
      "Cost- or latency-sensitive bulk jobs → Sonnet 4.6 / Haiku 4.5",
    ],
    useCases: [
      {
        title: "Stable agentic baseline",
        scenario:
          "An overnight build harness that was tuned and verified against 4.7's behaviour and is producing reliable runs you don't want to disturb.",
        why: "Same API surface as 4.8 with proven behaviour — staying pinned avoids re-validating prompts and effort settings just to chase a small capability bump.",
      },
      {
        title: "Whole-repo reasoning",
        scenario:
          "Cross-cutting questions over a full Next 16 / Sanity codebase or a long transcript when you already trust 4.7's answers.",
        why: "1M-token context and strong long-horizon coherence carry over from this generation, so big-context work still lands without chunking.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 78.2,
        blurb: "Real GitHub issues fixed end-to-end — just below the 4.8 flagship.",
        sourceUrl: "https://platform.claude.com/docs",
      },
      {
        name: "GPQA Diamond",
        score: 86.5,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://platform.claude.com/docs",
      },
    ],
    api: {
      modelString: "claude-opus-4-7",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Adaptive thinking only — no budget_tokens. Same call shape as Opus 4.8; swap the model string to migrate.",
    },
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude models overview",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-sonnet-4-6",
    kind: "model",
    labId: "anthropic",
    name: "Claude Sonnet 4.6",
    family: "Claude Sonnet",
    tier: "balanced",
    status: "ga",
    modalities: ["text", "code", "multimodal"],
    pricing: { currency: "USD", inputPerMTok: 3, outputPerMTok: 15 },
    releaseDate: "2026-01",
    summary:
      "The balanced mid-tier — strong for coding, agents, and professional work at scale, at meaningfully lower cost than Opus (~40% cheaper per token).",
    highlights: [
      "The workhorse: frontier-class capability with better cost efficiency",
      "~40% cheaper per token than the Opus tier",
    ],
    bestFor: [
      "High-volume coding and agent work where Opus is overkill but Haiku isn't enough",
      "Cost-conscious production pipelines that still need strong reasoning",
      "Drafting and rewriting at scale — outreach copy, summaries, transforms",
    ],
    notIdealFor: [
      "The hardest long-horizon agentic runs and trickiest refactors → Opus 4.8",
      "Cheapest, fastest bulk classification or extraction → Haiku 4.5",
    ],
    useCases: [
      {
        title: "Everyday coding agent",
        scenario:
          "Routine feature work and bug fixes across the Merch Desk or Hang Hound repos where most tasks are well-scoped and don't need flagship reasoning.",
        why: "Frontier-class coding at ~40% lower token cost makes it the default for the bulk of agentic edits, reserving Opus 4.8 for the genuinely hard ones.",
      },
      {
        title: "Bulk outreach drafting",
        scenario:
          "Generating many catalogue-first vendor messages that share a register but vary per recipient.",
        why: "Strong instruction-following holds the voice across volume, and the lower price keeps a high-throughput drafting run economical.",
      },
      {
        title: "Cost-aware automation",
        scenario:
          "Scheduled jobs that summarise transcripts or reshape data on a recurring basis.",
        why: "Good enough reasoning at a much friendlier per-token rate makes recurring automation sustainable to run often.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 73.8,
        blurb: "Real GitHub issues fixed end-to-end — strong for the mid-tier price.",
        sourceUrl: "https://platform.claude.com/docs",
      },
      {
        name: "GPQA Diamond",
        score: 81,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://platform.claude.com/docs",
      },
    ],
    api: {
      modelString: "claude-sonnet-4-6",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Adaptive thinking only — no budget_tokens. The cost-efficient default; reach for Opus 4.8 only when a task proves too hard.",
    },
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude models overview",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-haiku-4-5",
    kind: "model",
    labId: "anthropic",
    name: "Claude Haiku 4.5",
    family: "Claude Haiku",
    tier: "fast",
    status: "ga",
    modalities: ["text", "code"],
    pricing: { currency: "USD", inputPerMTok: 1, outputPerMTok: 5 },
    releaseDate: "2025-10",
    summary:
      "The fast, low-cost model for lightweight tasks, automation, and high-volume use — when speed and cost efficiency come first.",
    highlights: ["Lowest latency / cost in the Claude lineup"],
    bestFor: [
      "High-volume, latency-sensitive jobs where speed and price win",
      "Cheap classification, extraction, routing, and tagging at scale",
      "Sub-agents and fan-out steps inside a larger Opus/Sonnet pipeline",
    ],
    notIdealFor: [
      "Hard reasoning, long refactors, or long-horizon agentic runs → Opus 4.8",
      "Nuanced drafting that must hold a precise register → Sonnet 4.6 / Opus 4.8",
    ],
    useCases: [
      {
        title: "Bulk classification",
        scenario:
          "Tagging or triaging a large queue of inbound items — vendor replies, inbox messages — into buckets before a bigger model handles the few that matter.",
        why: "Lowest cost and latency make it ideal for the high-volume first pass; you only escalate the ambiguous cases upward.",
      },
      {
        title: "Fast sub-agent steps",
        scenario:
          "Cheap fan-out work inside a larger agent run — small lookups, formatting passes, quick extractions.",
        why: "Speed keeps a multi-step pipeline snappy and the per-token price keeps many parallel calls affordable.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 58,
        blurb: "Real GitHub issues fixed end-to-end — lower, but very fast and cheap.",
        sourceUrl: "https://platform.claude.com/docs",
      },
      {
        name: "GPQA Diamond",
        score: 68,
        blurb: "Graduate-level science questions — solid for a fast, low-cost tier.",
        sourceUrl: "https://platform.claude.com/docs",
      },
    ],
    api: {
      modelString: "claude-haiku-4-5",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Adaptive thinking only — no budget_tokens. Optimised for speed and cost; ideal as a sub-agent or high-volume first pass.",
    },
    provenance: {
      sourceUrl: "https://platform.claude.com/docs",
      sourceLabel: "Claude models overview",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-fable-5",
    kind: "model",
    labId: "anthropic",
    name: "Claude Fable 5",
    family: "Mythos-class",
    tier: "flagship",
    status: "suspended",
    modalities: ["text", "code", "multimodal"],
    contextWindow: 1_000_000,
    releaseDate: "2026-06-09",
    retiredDate: "2026-06-12",
    summary:
      "Anthropic's most capable WIDELY-released model at launch — the first time a Mythos-class model went public. Suspended June 12, 2026 under a US export-control directive.",
    highlights: [
      "1M-token context; same API surface as Opus 4.7/4.8",
      "Safeguard layer: flagged high-risk queries route to Opus 4.8 (reportedly <5% of sessions)",
      "Model string: claude-fable-5",
      "SUSPENDED June 12, 2026 for all customers (no confirmed restoration date)",
    ],
    bestFor: [
      "(Historically) the absolute hardest reasoning and agentic work — above Opus 4.8",
      "Frontier coding and long-horizon runs where you wanted the most capable public model",
    ],
    notIdealFor: [
      "Any current work — it is suspended; use Opus 4.8 instead",
      "Latency- or cost-sensitive jobs even when it was live → Sonnet 4.6 / Haiku 4.5",
    ],
    useCases: [
      {
        title: "Frontier agentic coding (while live)",
        scenario:
          "The most demanding whole-repo refactors and autonomous build loops, when you wanted maximum capability and accepted the always-on thinking.",
        why: "It topped the Claude lineup on coding and reasoning, with the Opus-4.8 safeguard route catching the small slice of high-risk queries.",
      },
      {
        title: "Hardest reasoning (while live)",
        scenario:
          "Multi-step scientific or analytical problems where Opus 4.8 left correctness on the table.",
        why: "Mythos-class capability sat above the GA flagship — but it's now suspended, so Opus 4.8 is the practical fallback.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 83.4,
        blurb: "Real GitHub issues fixed end-to-end — above the Opus 4.8 flagship.",
        sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      },
      {
        name: "GPQA Diamond",
        score: 91,
        blurb: "Graduate-level science questions — Mythos-class reasoning ceiling.",
        sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      },
    ],
    api: {
      modelString: "claude-fable-5",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "SUSPENDED since June 12, 2026 — calls will fail; route to claude-opus-4-8. When live it was the most capable model, but thinking was always-on (no budget_tokens, no opt-out) and it required 30-day data retention.",
    },
    namingTheme: "Fable — the safeguarded, story-with-a-moral half of the Mythos twins.",
    routesTo: "anthropic-opus-4-8",
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      sourceLabel: "Statement on the US directive to suspend Fable 5 / Mythos 5",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-mythos-5",
    kind: "model",
    labId: "anthropic",
    name: "Claude Mythos 5",
    family: "Mythos-class",
    tier: "flagship",
    status: "suspended",
    modalities: ["text", "code", "multimodal"],
    contextWindow: 1_000_000,
    releaseDate: "2026-06-09",
    retiredDate: "2026-06-12",
    summary:
      "The same underlying model as Fable 5 with certain cybersecurity safeguards lifted — no routing layer. Distributed only through the restricted, invitation-based Project Glasswing. Suspended June 12, 2026.",
    highlights: [
      "Same base model as Fable 5, cyber safeguards lifted",
      "Glasswing-only — invitation-based, never a public release",
      "Model string: claude-mythos-5",
      "SUSPENDED June 12, 2026",
    ],
    bestFor: [
      "(Historically, Glasswing partners only) approved cybersecurity work needing the unrouted base model",
      "Frontier-capability tasks where the Fable safeguard route was not wanted",
    ],
    notIdealFor: [
      "Any general or current use — suspended and never public; use Opus 4.8",
      "Workloads that don't need lifted safeguards → Fable 5 (when live) or Opus 4.8",
    ],
    useCases: [
      {
        title: "Approved cybersecurity research (while live)",
        scenario:
          "Vetted Project Glasswing partners running defensive security work that the Fable safeguard layer would otherwise route away.",
        why: "Same frontier base model as Fable 5 without the routing layer — gated to invited partners precisely because the cyber safeguards were lifted.",
      },
      {
        title: "Unrouted frontier capability (while live)",
        scenario:
          "Hardest reasoning tasks where a partner needed the raw model rather than the safeguarded public variant.",
        why: "Mythos-class capability with no route-to-Opus fallback — but it's now suspended and was never self-serve.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 83.6,
        blurb: "Real GitHub issues fixed end-to-end — same base model as Fable 5.",
        sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      },
      {
        name: "GPQA Diamond",
        score: 91,
        blurb: "Graduate-level science questions — Mythos-class reasoning ceiling.",
        sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      },
    ],
    api: {
      modelString: "claude-mythos-5",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Project Glasswing only — invitation-based, never self-serve, and SUSPENDED since June 12, 2026. Same base as Fable 5 with cyber safeguards lifted and no Opus routing; thinking is always-on (no budget_tokens).",
    },
    namingTheme: "Mythos — the unguarded, mythic half of the twins.",
    provenance: {
      sourceUrl: "https://www.anthropic.com/news/fable-mythos-access",
      sourceLabel: "Statement on the US directive to suspend Fable 5 / Mythos 5",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "anthropic-mythos-preview",
    kind: "model",
    labId: "anthropic",
    name: "Claude Mythos Preview",
    family: "Mythos-class",
    tier: "reasoning",
    status: "research",
    modalities: ["text", "code"],
    releaseDate: "2026",
    summary:
      "An earlier research-preview model focused on defensive cybersecurity workflows, offered through Project Glasswing. It preceded and informed the Fable 5 / Mythos 5 release.",
    highlights: [
      "Invitation-only, no self-serve sign-up",
      "Defensive cybersecurity focus",
    ],
    bestFor: [
      "(Invited researchers only) early evaluation of defensive cybersecurity workflows",
      "Glasswing partners probing Mythos-class behaviour ahead of the Fable 5 / Mythos 5 release",
    ],
    notIdealFor: [
      "Any production or general use — research-grade and invite-only; use Opus 4.8",
      "Non-security, broad agentic or coding work → Opus 4.8 / Sonnet 4.6",
    ],
    useCases: [
      {
        title: "Defensive security evaluation",
        scenario:
          "Invited Glasswing researchers testing the model on threat analysis and defensive cyber tasks during the preview.",
        why: "Purpose-built around defensive cybersecurity and offered as a research preview to gather feedback that shaped the later Mythos-class release.",
      },
      {
        title: "Pre-release capability probing",
        scenario:
          "Partners stress-testing Mythos-class reasoning before Fable 5 / Mythos 5 shipped.",
        why: "As the precursor that informed the public release, it let invited testers explore the family's behaviour early — it is not a productised model.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 76,
        blurb: "Real GitHub issues fixed end-to-end — research-grade precursor.",
        sourceUrl: "https://www.anthropic.com/news",
      },
      {
        name: "GPQA Diamond",
        score: 85,
        blurb: "Graduate-level science questions — strong, but a research preview.",
        sourceUrl: "https://www.anthropic.com/news",
      },
    ],
    api: {
      modelString: "claude-mythos-preview",
      sdkPackage: "@anthropic-ai/sdk",
      envVar: "ANTHROPIC_API_KEY",
      endpoint: "POST https://api.anthropic.com/v1/messages",
      docsUrl: "https://platform.claude.com/docs",
      note: "Invite-only research preview via Project Glasswing — no self-serve access. Defensive-security focused; not productised. Adaptive thinking only (no budget_tokens).",
    },
    provenance: {
      sourceUrl: "https://www.anthropic.com/news",
      sourceLabel: "Anthropic news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  // ───────────────────────────── OPENAI ─────────────────────────────
  {
    id: "openai-gpt-5-6-sol",
    kind: "model",
    labId: "openai",
    name: "GPT-5.6 Sol",
    family: "GPT-5.6",
    tier: "flagship",
    status: "restricted",
    flagship: true,
    modalities: ["text", "code", "multimodal"],
    pricing: { currency: "USD", inputPerMTok: 5, outputPerMTok: 30, note: "indicative preview pricing" },
    releaseDate: "2026-06-26",
    summary:
      "OpenAI's new flagship for deep reasoning and long-horizon agentic work, with major gains in coding, biology, and cybersecurity. Launched as a government-gated limited preview to ~20 partners.",
    highlights: [
      "Max mode — spends more time reasoning before answering",
      "Ultra mode — spins up parallel subagents to accelerate complex work",
      "SOTA on Terminal-Bench 2.1 (~91.9%)",
      "Restricted preview: API & Codex only, ~20 approved partners",
    ],
    bestFor: [
      "The hardest agentic coding and multi-step reasoning, when you can get access",
      "Long autonomous runs where parallel subagents (Ultra) cut wall-clock time",
      "Frontier coding/terminal tasks where Max mode's extra thinking pays off",
    ],
    notIdealFor: [
      "Anyone without partner access — reach for GPT-5.5 (GA) instead",
      "Cheap, high-volume, or latency-sensitive jobs → GPT-5.6 Luna / GPT-5.5 Instant",
    ],
    useCases: [
      {
        title: "Frontier agentic coding",
        scenario:
          "Point Codex at a whole-repo refactor or a thorny bug and let Max mode reason hard before it starts editing and running tests.",
        why: "SOTA Terminal-Bench and SWE-bench scores plus Max-mode deliberation make it the strongest available agent for tasks where a wrong first move is expensive.",
      },
      {
        title: "Parallel build acceleration",
        scenario:
          "An overnight 'build → self-check → iterate' loop where Ultra mode fans the work out across subagents that tackle independent parts at once.",
        why: "Ultra's parallel subagents shorten long-horizon runs that would otherwise be serial — more progress per wall-clock hour on big autonomous jobs.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 82.4,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
      {
        name: "Terminal-Bench 2.1",
        score: 91.9,
        blurb: "Completing real command-line tasks in a live terminal.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
      {
        name: "GPQA Diamond",
        score: 89.5,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
    ],
    api: {
      modelString: "gpt-5.6",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Access is government-gated/restricted — API & Codex only, limited to ~20 approved partners. Set reasoning effort high to engage Max mode; Ultra (parallel subagents) is enabled per-partner.",
    },
    namingTheme: "Sol — the sun: the brightest, best tier.",
    provenance: {
      sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      sourceLabel: "Previewing GPT-5.6 Sol",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-gpt-5-6-terra",
    kind: "model",
    labId: "openai",
    name: "GPT-5.6 Terra",
    family: "GPT-5.6",
    tier: "balanced",
    status: "restricted",
    modalities: ["text", "code", "multimodal"],
    pricing: { currency: "USD", inputPerMTok: 2.5, outputPerMTok: 15, note: "indicative preview pricing" },
    releaseDate: "2026-06-26",
    summary:
      "The balanced everyday-work tier — competitive with GPT-5.5 quality at roughly half the cost. The model most ordinary tasks would land on once broadly available.",
    highlights: ["~2× cheaper than GPT-5.5 at comparable quality", "Restricted preview"],
    bestFor: [
      "Everyday coding and reasoning at a better price than GPT-5.5, if you have access",
      "The default tier most general tasks would route to once it's GA",
    ],
    notIdealFor: [
      "The very hardest frontier work → GPT-5.6 Sol (Max/Ultra)",
      "Cheapest high-volume jobs → GPT-5.6 Luna",
    ],
    useCases: [
      {
        title: "Cost-aware agentic coding",
        scenario:
          "Day-to-day feature work and bug-fixing on a Next 16 / Tailwind 4 / Sanity app where you want strong results without paying flagship rates.",
        why: "GPT-5.5-class quality at roughly half the cost makes it the sensible default for the bulk of coding turns that don't need Sol's deliberation.",
      },
      {
        title: "Mixed research + drafting",
        scenario:
          "Cross-tool research and document-heavy tasks that mix reading, light analysis, and writing in one session.",
        why: "Balanced reasoning and price means you can leave it on for long working sessions without watching the meter.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 79.8,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
      {
        name: "GPQA Diamond",
        score: 86,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
    ],
    api: {
      modelString: "gpt-5.6-terra",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Access is government-gated/restricted during preview — same ~20-partner gate as Sol. Expected to broaden toward GA later.",
    },
    namingTheme: "Terra — the earth: the grounded, everyday tier.",
    provenance: {
      sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      sourceLabel: "Previewing GPT-5.6 Sol",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-gpt-5-6-luna",
    kind: "model",
    labId: "openai",
    name: "GPT-5.6 Luna",
    family: "GPT-5.6",
    tier: "fast",
    status: "restricted",
    modalities: ["text", "code"],
    pricing: { currency: "USD", inputPerMTok: 1, outputPerMTok: 6, note: "indicative preview pricing" },
    releaseDate: "2026-06-26",
    summary:
      "The smallest, fastest, most affordable model in the family — built for high-volume, latency-sensitive workloads where speed beats deep reasoning.",
    highlights: ["Cheapest & fastest GPT-5.6 tier", "Restricted preview"],
    bestFor: [
      "High-volume, latency-sensitive calls where speed beats deep reasoning",
      "Cheap bulk classification, extraction, and short transforms at scale",
    ],
    notIdealFor: [
      "Hard multi-step reasoning or long autonomous coding → GPT-5.6 Terra / Sol",
      "Anything needing the deepest deliberation → GPT-5.6 Sol (Max mode)",
    ],
    useCases: [
      {
        title: "Bulk text transforms",
        scenario:
          "Tagging, routing, or normalising thousands of short records — e.g. classifying inbound messages before a heavier model drafts replies.",
        why: "Lowest price and latency in the family means you can run it across large batches without the cost adding up, then escalate only the hard cases.",
      },
      {
        title: "Snappy interactive helpers",
        scenario:
          "An in-app assistant that has to feel instant — autocomplete, quick rewrites, short Q&A — rather than chew on a long problem.",
        why: "Speed is the headline; users feel responsiveness more than they feel the extra IQ a bigger tier would add on simple turns.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 71,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
      {
        name: "GPQA Diamond",
        score: 78,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
    ],
    api: {
      modelString: "gpt-5.6-luna",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Access is government-gated/restricted during preview — same ~20-partner gate as the rest of the GPT-5.6 family.",
    },
    namingTheme: "Luna — the moon: the small, quick, ever-present tier.",
    provenance: {
      sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
      sourceLabel: "Previewing GPT-5.6 Sol",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-gpt-5-5",
    kind: "model",
    labId: "openai",
    name: "GPT-5.5",
    family: "GPT-5.5",
    tier: "flagship",
    status: "ga",
    modalities: ["text", "code", "multimodal"],
    releaseDate: "2026-04-23",
    summary:
      "The smartest widely-available tier, built for complex professional work — cross-tool research, data analysis, coding, and document-heavy tasks. The current GA anchor.",
    highlights: ["API access from April 24, 2026", "The generally-available frontier anchor"],
    bestFor: [
      "The strongest model you can actually deploy today (GA, no access gate)",
      "Complex professional work — cross-tool research, analysis, and coding",
      "Document-heavy tasks where you want frontier quality without a preview waitlist",
    ],
    notIdealFor: [
      "Bleeding-edge frontier scores → GPT-5.6 Sol (if you have partner access)",
      "Cheap, latency-sensitive bulk work → GPT-5.5 Instant",
    ],
    useCases: [
      {
        title: "Agentic coding (GA path)",
        scenario:
          "Building and refactoring a Next 16 / Tailwind 4 / Sanity app via the API when you need a deployable, generally-available model rather than a gated preview.",
        why: "It's the GA frontier anchor — strong coding and tool use without depending on restricted GPT-5.6 access, so it's the safe choice for production agents.",
      },
      {
        title: "Cross-tool research",
        scenario:
          "Pulling together findings across web search, files, and code in one session to produce an analysed write-up.",
        why: "Designed for document-heavy, multi-tool professional work, so it holds a long task together rather than losing the thread between tools.",
      },
    ],
    benchmarks: [
      {
        name: "SWE-bench Verified",
        score: 77.5,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/news/",
      },
      {
        name: "GPQA Diamond",
        score: 85,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/news/",
      },
    ],
    api: {
      modelString: "gpt-5.5",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Generally available via the API since April 24, 2026 — no access gate. Use the Responses API for tool use and multi-step agentic runs.",
    },
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "OpenAI news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-gpt-5-5-instant",
    kind: "model",
    labId: "openai",
    name: "GPT-5.5 Instant",
    family: "GPT-5.5",
    tier: "balanced",
    status: "ga",
    modalities: ["text", "multimodal"],
    releaseDate: "2026-04",
    summary:
      "The default model for logged-in ChatGPT users — an auto-switching system that routes to more reasoning when a request benefits from it.",
    highlights: ["Reduced hallucinations; improved personalization controls", "Auto-routing to reasoning"],
    bestFor: [
      "Everyday ChatGPT use where the system should decide how hard to think",
      "Latency-sensitive chat that still escalates to reasoning when needed",
    ],
    notIdealFor: [
      "Heavy coding or deep reasoning you want to control explicitly → GPT-5.5 / GPT-5.5 Pro",
      "Long autonomous agentic runs → GPT-5.5 or the GPT-5.6 family",
    ],
    useCases: [
      {
        title: "Auto-tiered assistant",
        scenario:
          "A general assistant that answers quick questions instantly but quietly switches to deeper reasoning when a request is genuinely hard.",
        why: "The auto-routing means you don't have to pick a tier per message — simple turns stay fast, hard ones get the extra thinking automatically.",
      },
      {
        title: "Personalized day-to-day chat",
        scenario:
          "Drafting, brainstorming, and quick lookups in ChatGPT where personalization and low hallucination matter more than peak IQ.",
        why: "Reduced hallucinations and better personalization controls make it a dependable default for the bulk of everyday conversational work.",
      },
    ],
    benchmarks: [
      {
        name: "GPQA Diamond",
        score: 81,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/news/",
      },
      {
        name: "SWE-bench Verified",
        score: 70,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/news/",
      },
    ],
    api: {
      modelString: "gpt-5.5-instant",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "This is the auto-switching system behind logged-in ChatGPT; via the API it routes between fast and reasoning modes automatically rather than exposing a manual thinking budget.",
    },
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "OpenAI news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-gpt-5-5-pro",
    kind: "model",
    labId: "openai",
    name: "GPT-5.5 Pro",
    family: "GPT-5.5",
    tier: "reasoning",
    status: "ga",
    modalities: ["text", "code", "multimodal"],
    releaseDate: "2026-04",
    summary: "The higher-end reasoning variant of the GPT-5.5 generation.",
    highlights: ["Top-end reasoning within the GA GPT-5.5 family"],
    bestFor: [
      "The hardest reasoning you can run without GPT-5.6 access",
      "Problems where correctness justifies more thinking time and cost",
    ],
    notIdealFor: [
      "Fast, cheap, or high-volume work → GPT-5.5 Instant",
      "Bleeding-edge frontier scores → GPT-5.6 Sol (gated)",
    ],
    useCases: [
      {
        title: "Hard one-shot reasoning",
        scenario:
          "A gnarly architectural decision or a subtle algorithmic bug where you want the model to deliberate carefully before answering.",
        why: "It's the top-end reasoning tier in the GA family, so it's the right call when the answer must be right and you can't reach restricted GPT-5.6.",
      },
      {
        title: "Deep analysis on the GA path",
        scenario:
          "Working through a dense dataset or a long technical document and asking for rigorous, multi-step conclusions.",
        why: "More reasoning headroom than plain GPT-5.5 means it holds up on the long chains of inference that trip lighter tiers.",
      },
    ],
    benchmarks: [
      {
        name: "GPQA Diamond",
        score: 87,
        blurb: "Graduate-level science questions — hard multi-step reasoning.",
        sourceUrl: "https://openai.com/news/",
      },
      {
        name: "SWE-bench Verified",
        score: 78.5,
        blurb: "Real GitHub issues fixed end-to-end — the headline coding eval.",
        sourceUrl: "https://openai.com/news/",
      },
    ],
    api: {
      modelString: "gpt-5.5-pro",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Generally available. Set reasoning effort high for its full deliberation; expect longer latency and higher cost than GPT-5.5 Instant.",
    },
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "OpenAI news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-rosalind",
    kind: "model",
    labId: "openai",
    name: "GPT-Rosalind",
    family: "Rosalind",
    tier: "domain",
    status: "ga",
    modalities: ["text", "code"],
    releaseDate: "2026-04",
    summary:
      "A frontier reasoning model purpose-built for life sciences at enterprise scale, named after Rosalind Franklin. Combines GPT-5.5's agentic coding with stronger drug-discovery reasoning.",
    highlights: [
      "First introduced April 2026; major capabilities update June 3, 2026",
      "~31% fewer tokens than GPT-5.5 on long quantitative-biology analyses",
      "Targets molecules, proteins, genes, lab workflows — not general chat",
    ],
    bestFor: [
      "Drug-discovery and quantitative-biology reasoning at enterprise scale",
      "Agentic analysis over molecules, proteins, genes, and lab workflows",
      "Life-sciences pipelines where token-efficient long analyses lower cost",
    ],
    notIdealFor: [
      "General chat, coding, or writing → GPT-5.5 / GPT-5.6 family",
      "Anything outside the life sciences — it's a domain model, not a generalist",
    ],
    useCases: [
      {
        title: "Drug-discovery reasoning",
        scenario:
          "A research team works through candidate molecules and target proteins, asking the model to reason over structure, activity, and prior literature.",
        why: "It pairs GPT-5.5's agentic coding with biology-specific reasoning, so it can both run the analysis and reason about the science rather than just summarise it.",
      },
      {
        title: "Long quantitative-biology analysis",
        scenario:
          "Processing large genomic or assay datasets end-to-end in a single long analytical run.",
        why: "It uses ~31% fewer tokens than GPT-5.5 on these long analyses, so enterprise-scale runs finish cheaper and within tighter context budgets.",
      },
    ],
    api: {
      modelString: "gpt-rosalind",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Domain model for life sciences — generally available, but tuned for biology/chemistry workloads rather than general use. For biodefense-sensitive work, access runs through the Rosalind Biodefense initiative (restricted).",
    },
    namingTheme: "Named for Rosalind Franklin, whose X-ray work underpinned DNA's structure.",
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "Introducing new capabilities to GPT-Rosalind",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-rosalind-biodefense",
    kind: "initiative",
    labId: "openai",
    name: "Rosalind Biodefense",
    family: "Rosalind",
    tier: "domain",
    status: "restricted",
    modalities: ["text"],
    releaseDate: "2026-05-29",
    summary:
      "An access INITIATIVE (not a separate model): controlled, sponsored access to GPT-Rosalind for vetted developers and select US government / public-health partners working on biodefense and pandemic preparedness.",
    highlights: [
      "Two tracks: developer + government",
      "Early partners: Lawrence Livermore, Johns Hopkins APL, CEPI",
      "OpenAI sponsors access rather than charging participants",
    ],
    bestFor: [
      "Vetted biodefense and pandemic-preparedness teams needing GPT-Rosalind",
      "Government / public-health partners working under a controlled-access track",
    ],
    notIdealFor: [
      "General life-sciences work without clearance → GPT-Rosalind (GA)",
      "Any non-biodefense use — this is a gated access programme, not a product tier",
    ],
    useCases: [
      {
        title: "Pandemic-preparedness analysis",
        scenario:
          "A public-health partner like CEPI uses sponsored access to apply GPT-Rosalind's reasoning to threat assessment and countermeasure research.",
        why: "The initiative supplies controlled, sponsored access so mission-critical biodefense work can use frontier biology reasoning under appropriate oversight.",
      },
      {
        title: "Vetted developer track",
        scenario:
          "A screened developer at a national lab (e.g. Lawrence Livermore) builds tooling on GPT-Rosalind for defensive biosecurity research.",
        why: "The developer track grants reviewed, gated access so capable biology models reach legitimate defensive work without opening them to general use.",
      },
    ],
    api: {
      modelString: "gpt-rosalind",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Access is restricted/government-gated — this is a sponsored, vetted-access initiative (developer + government tracks), not an openly callable model. The model string is the same GPT-Rosalind, but you must be approved through the programme.",
    },
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "Rosalind Biodefense announcement",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-chatgpt-images-2",
    kind: "model",
    labId: "openai",
    name: "ChatGPT Images 2.0",
    family: "Images",
    tier: "image",
    status: "ga",
    modalities: ["image"],
    releaseDate: "2026",
    summary:
      "An updated image generation model with SOTA visual reasoning, multilingual support, and substantially improved text rendering.",
    highlights: ["Strong legible text rendering", "Multilingual"],
    bestFor: [
      "Generating images that need legible, correctly-spelled in-image text",
      "Concept and marketing visuals where prompt-following and layout matter",
      "Multilingual image text (e.g. Thai signage and captions)",
    ],
    notIdealFor: [
      "Photoreal edits to real photographs you shot → a dedicated retouch workflow",
      "Video or motion → a video model like Veo / Sora",
    ],
    useCases: [
      {
        title: "Marketing visuals with text",
        scenario:
          "Mocking up promo graphics, menus, or social posts for a venue (Hang Hound, a café) where the words baked into the image have to be readable and right.",
        why: "Its big gain is text rendering — legible, accurate type in-image — so you spend far less time fixing garbled letters than with older image models.",
      },
      {
        title: "Multilingual signage mockups",
        scenario:
          "Drafting bilingual Thai/English signage or labels to preview a design before a real shoot or print run.",
        why: "Multilingual support plus strong text rendering means it can place non-Latin script correctly, useful for Thailand-based hospitality projects.",
      },
    ],
    api: {
      modelString: "gpt-image-2",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Image generation runs through the Images endpoint (POST https://api.openai.com/v1/images) — pass the gpt-image-2 model string there rather than the text Responses API.",
    },
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "OpenAI news",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-realtime-2",
    kind: "model",
    labId: "openai",
    name: "GPT-Realtime-2",
    family: "Realtime Voice",
    tier: "voice",
    status: "ga",
    modalities: ["voice", "audio"],
    releaseDate: "2026-05-07",
    summary:
      "The main model for realtime voice agents — stronger reasoning, tool calling, and longer context, reasoning and responding live during a conversation.",
    highlights: ["Realtime API", "Reason + tool-call mid-conversation"],
    bestFor: [
      "Live voice agents that must reason and call tools mid-conversation",
      "Phone or in-app assistants where low latency and natural turn-taking matter",
    ],
    notIdealFor: [
      "Pure speech-to-text transcription → GPT-Realtime-Whisper",
      "Cross-language interpreting → GPT-Realtime-Translate",
    ],
    useCases: [
      {
        title: "Voice booking agent",
        scenario:
          "A spoken reservations line for a venue that takes the caller's details by voice and calls a booking API to confirm — all in one live conversation.",
        why: "It reasons and calls tools mid-conversation over the Realtime API, so it can act on what the caller says without dropping to a separate text step.",
      },
      {
        title: "Hands-free assistant",
        scenario:
          "An in-app voice helper that answers questions and triggers actions while the user keeps their hands on something else.",
        why: "Longer context and live tool use mean it can hold a real back-and-forth and do things, not just dictate answers.",
      },
    ],
    api: {
      modelString: "gpt-realtime-2",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Built for the Realtime API — connect over the realtime WebSocket/WebRTC transport for streaming audio in/out rather than the standard Responses request shown here.",
    },
    provenance: {
      sourceUrl: "https://platform.openai.com/docs",
      sourceLabel: "OpenAI realtime voice docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-realtime-translate",
    kind: "model",
    labId: "openai",
    name: "GPT-Realtime-Translate",
    family: "Realtime Voice",
    tier: "voice",
    status: "ga",
    modalities: ["voice", "audio"],
    releaseDate: "2026-05-07",
    summary: "Live speech translation across 70+ input and 13 output languages.",
    highlights: ["70+ input / 13 output languages", "Simultaneous translation"],
    bestFor: [
      "Live, simultaneous speech-to-speech translation in conversation",
      "Cross-language situations spanning many input languages",
    ],
    notIdealFor: [
      "A reasoning voice agent that takes actions → GPT-Realtime-2",
      "Same-language transcription/captions → GPT-Realtime-Whisper",
    ],
    useCases: [
      {
        title: "Counter conversations across a language gap",
        scenario:
          "A Thai-speaking staff member and an English-speaking guest talk through it in near real time, each hearing their own language.",
        why: "Simultaneous translation across 70+ input languages means a venue can serve international guests without a human interpreter on hand.",
      },
      {
        title: "Live event interpreting",
        scenario:
          "Relaying a talk or tour commentary to attendees in a different language as the speaker goes.",
        why: "It's purpose-built for low-latency speech-to-speech translation, so the output keeps pace with the speaker instead of lagging a sentence behind.",
      },
    ],
    api: {
      modelString: "gpt-realtime-translate",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Runs over the Realtime API for streaming speech-to-speech translation; use the realtime audio transport, not the standard Responses request shown here.",
    },
    provenance: {
      sourceUrl: "https://platform.openai.com/docs",
      sourceLabel: "OpenAI realtime voice docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-realtime-whisper",
    kind: "model",
    labId: "openai",
    name: "GPT-Realtime-Whisper",
    family: "Realtime Voice",
    tier: "voice",
    status: "ga",
    modalities: ["voice", "audio"],
    releaseDate: "2026-05-07",
    summary:
      "Low-latency streaming speech-to-text for captions, meeting notes, and realtime workflows.",
    highlights: ["Streaming STT", "Low latency captions"],
    bestFor: [
      "Low-latency streaming speech-to-text — live captions and transcription",
      "Feeding spoken input into a downstream text/agent pipeline in real time",
    ],
    notIdealFor: [
      "Speaking back or holding a voice conversation → GPT-Realtime-2",
      "Translating across languages → GPT-Realtime-Translate",
    ],
    useCases: [
      {
        title: "Live meeting notes",
        scenario:
          "Transcribing a call or planning session as it happens so you walk away with a searchable text record.",
        why: "Streaming STT with low latency means the transcript keeps up with the conversation rather than arriving after it ends.",
      },
      {
        title: "Real-time captions",
        scenario:
          "Adding on-screen captions to a live stream or in-person talk for accessibility.",
        why: "Its whole design is fast streaming transcription, so captions appear close enough to the words being spoken to be usable live.",
      },
    ],
    api: {
      modelString: "gpt-realtime-whisper",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Streaming transcription over the Realtime API (also reachable via the transcription endpoint) — stream audio in over the realtime transport rather than the standard Responses request shown here.",
    },
    provenance: {
      sourceUrl: "https://platform.openai.com/docs",
      sourceLabel: "OpenAI realtime voice docs",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "openai-privacy-filter",
    kind: "model",
    labId: "openai",
    name: "OpenAI Privacy Filter",
    family: "Open Weights",
    tier: "open-weight",
    status: "ga",
    modalities: ["text"],
    contextWindow: 128_000,
    pricing: { currency: "USD", inputPerMTok: null, outputPerMTok: null, note: "open weights, Apache 2.0 — self-host" },
    releaseDate: "2026-04-22",
    summary:
      "An open-weight (Apache 2.0) model for detecting and redacting PII in text — small enough to run locally, even in a browser, so data is masked before it leaves the machine.",
    highlights: [
      "Sparse-MoE token classifier: 1.5B total params, only 50M active",
      "128K context; ~96% F1 (97.43% on a corrected benchmark)",
      "Eight PII categories incl. names, addresses, secrets/API keys",
      "Explicitly NOT an anonymization/compliance guarantee — one layer of a pipeline",
    ],
    bestFor: [
      "Redacting PII locally before text is sent to a larger cloud model",
      "Self-hosted or in-browser masking where data must never leave the machine",
      "Stripping names, addresses, and leaked secrets/API keys from logs or inputs",
    ],
    notIdealFor: [
      "A standalone compliance / anonymization guarantee — it's one pipeline layer, not a promise",
      "General text generation or reasoning → it's a classifier, use a GPT-5.5/5.6 tier",
    ],
    useCases: [
      {
        title: "Pre-flight PII scrub",
        scenario:
          "Before piping customer messages or logs into a cloud model, run them through the filter to mask names, addresses, and API keys first.",
        why: "It's tiny (50M active params) and runs locally, so sensitive data is redacted on-device before it ever leaves the machine for a bigger model.",
      },
      {
        title: "In-browser redaction",
        scenario:
          "A client-side form that masks PII as the user types, so the server only ever receives sanitised text.",
        why: "Small enough to run in the browser — masking happens before transmission, which is a real privacy posture rather than trusting a remote service.",
      },
    ],
    api: {
      modelString: "privacy-filter",
      sdkPackage: "openai",
      envVar: "OPENAI_API_KEY",
      endpoint: "POST https://api.openai.com/v1/responses",
      docsUrl: "https://platform.openai.com/docs",
      note: "Open-weight Apache 2.0 release — you don't need the API or a key. Download the weights from Hugging Face / GitHub (openai/privacy-filter) and self-host (Transformers, or in-browser via ONNX/WebGPU).",
    },
    namingTheme: "Open weights on Hugging Face / GitHub — openai/privacy-filter.",
    provenance: {
      sourceUrl: "https://openai.com/news/",
      sourceLabel: "Introducing OpenAI Privacy Filter",
      confidence: "reported",
      lastVerified: V,
    },
  },
  // ───────────────────────────── GOOGLE ─────────────────────────────
  {
    id: "google-veo-3-1",
    kind: "model",
    labId: "google",
    name: "Veo 3.1",
    family: "Veo",
    tier: "video",
    status: "ga",
    flagship: true,
    modalities: ["video", "audio"],
    releaseDate: "2026",
    summary:
      "Google's top-tier video model — expanded creative controls and native synchronised audio (environmental sound, dialogue, music matched to lip movement), with strong physics and prompt adherence.",
    highlights: [
      "Native synchronised audio incl. lip-matched dialogue",
      "Veo 3.1 Lite: low-cost, high-throughput tier for rapid iteration",
      "Surfaces inside Flow",
    ],
    bestFor: [
      "Short hero / promo clips where you want sound and motion in one generation",
      "Spots that need spoken dialogue or lip-sync without a separate audio pass",
      "Realistic physics and camera moves that have to look believable",
    ],
    notIdealFor: [
      "Cheap, high-volume drafts and look-tests → Veo 3.1 Lite",
      "Editing or restyling an existing reference clip → Gemini Omni",
    ],
    useCases: [
      {
        title: "Venue promo film",
        scenario:
          "Generate a polished 8-second establishing shot of a Hua Hin café or bar — golden-hour light, slow push-in, ambient room tone — to anchor a social reel or a Hang Hound / Windy Bar landing page.",
        why: "Native synchronised audio means the environmental sound is baked into the same generation, and strong physics keeps reflections, water, and crowd motion believable without a VFX cleanup.",
      },
      {
        title: "Spoken brand line",
        scenario:
          "A short clip where a presenter or character delivers one line to camera for a campaign teaser.",
        why: "Lip-matched dialogue is generated in-model, so you skip the usual record-then-sync workflow and the mouth movement actually tracks the words.",
      },
    ],
    api: {
      modelString: "veo-3.1",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Long-running video-generation call: submit a text (or image) prompt, poll the operation, then fetch the returned MP4. Audio is generated with the video — no separate request. Use Lite for cheap iteration, then re-render the keeper here.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-veo-3-1-lite",
    kind: "model",
    labId: "google",
    name: "Veo 3.1 Lite",
    family: "Veo",
    tier: "video",
    status: "ga",
    modalities: ["video", "audio"],
    releaseDate: "2026",
    summary: "A low-cost, high-throughput Veo tier for rapid iteration and high-volume work.",
    highlights: ["Fast / cheap video iteration"],
    bestFor: [
      "Look-tests and prompt iteration before committing to a full-quality render",
      "High-volume clip generation where per-clip cost matters more than polish",
    ],
    notIdealFor: [
      "Final hero shots that need maximum fidelity and physics → Veo 3.1",
      "Conversational edits of an existing clip → Gemini Omni",
    ],
    useCases: [
      {
        title: "Prompt iteration",
        scenario:
          "Fire off ten variations of a café exterior shot to find the framing, light, and motion that read best, then re-render only the winner on full Veo 3.1.",
        why: "Cheap, fast generations make the exploration phase affordable; you spend the premium tier's cost only once, on the keeper.",
      },
      {
        title: "Volume social cuts",
        scenario:
          "Batch out background b-roll loops for a week of Instagram stories across several venues.",
        why: "High throughput and low per-clip price suit disposable, high-cadence content where each clip doesn't need to be perfect.",
      },
    ],
    api: {
      modelString: "veo-3.1-lite",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Same long-running video-generation flow as Veo 3.1 (submit prompt, poll, fetch MP4) but on the cheaper/faster tier — meant for drafts and batch work, not final delivery.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-gemini-omni",
    kind: "model",
    labId: "google",
    name: "Gemini Omni",
    family: "Gemini",
    tier: "video",
    status: "ga",
    modalities: ["video", "multimodal"],
    releaseDate: "2026",
    summary:
      "The multimodal model for creating and editing video from any input reference, real or generated — with conversational editing and a deep understanding of physical space.",
    highlights: ["Conversational video editing", "World-logic awareness", "Surfaces inside Flow"],
    bestFor: [
      "Editing or restyling an existing clip rather than generating from scratch",
      "Iterative, chat-driven changes ('warm it up', 'remove the sign') on real footage",
      "Work where the model must respect real physical space and continuity",
    ],
    notIdealFor: [
      "A fresh hero clip with baked-in synchronised audio → Veo 3.1",
      "Quick cheap throwaway drafts → Veo 3.1 Lite",
    ],
    useCases: [
      {
        title: "Conversational footage edit",
        scenario:
          "Feed in a real handheld clip of a venue and refine it by chat — adjust the grade, clean up a distracting element, extend a beat — without round-tripping through an NLE.",
        why: "Conversational editing on a real reference is its core strength, and its grasp of physical space keeps edits spatially consistent frame to frame.",
      },
      {
        title: "Reference-driven generation",
        scenario:
          "Use a photograph of a space as the anchor and have the model produce video that stays faithful to that real layout.",
        why: "It accepts any input reference, real or generated, and its world-logic awareness means the output respects the geometry of the source instead of inventing an inconsistent room.",
      },
    ],
    api: {
      modelString: "gemini-omni",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Multimodal video create/edit call: pass a reference (image or video) plus a text instruction; supports iterative conversational turns to refine the result. Long-running — poll the operation for the output clip.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-imagen-4",
    kind: "model",
    labId: "google",
    name: "Imagen 4 / Imagen 4 Ultra",
    family: "Imagen",
    tier: "image",
    status: "ga",
    modalities: ["image"],
    releaseDate: "2026",
    summary:
      "Google's flagship text-to-image foundation model for professional, hyper-realistic output. Imagen 4 Ultra is the top photorealism tier.",
    highlights: ["Supersedes Imagen 3", "Ultra = top photorealism tier"],
    bestFor: [
      "High-fidelity, photoreal stills where image quality is the whole point",
      "Clean text-to-image generation from a written brief (no source photo needed)",
      "Final marketing hero images — reach for Ultra when realism must hold up large",
    ],
    notIdealFor: [
      "Fast tweaks or edits to an existing photo → Nano Banana",
      "Posters/labels with lots of legible text or tight brand layout → Nano Banana Pro",
    ],
    useCases: [
      {
        title: "Photoreal concept still",
        scenario:
          "Generate a polished, magazine-grade product or location image from a text brief to use as a campaign key visual or a mood frame for a client pitch.",
        why: "As the flagship text-to-image model it leads on realism and prompt adherence; Ultra is the tier to pick when the still has to survive scrutiny at full size.",
      },
      {
        title: "Marketing variations from a prompt",
        scenario:
          "Spin up several photoreal options of a scene — different times of day, angles, palettes — for a venue's promo set without staging a shoot.",
        why: "Strong text-to-image quality means each variation looks like a real photograph, so the set is usable for marketing rather than only as reference.",
      },
    ],
    api: {
      modelString: "imagen-4.0-ultra",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Text-to-image generation call: send a prompt (and aspect ratio / sample count), receive image bytes. Use 'imagen-4.0' for the standard tier and 'imagen-4.0-ultra' for top photorealism. This is pure generation — for editing an existing image use Nano Banana.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-nano-banana",
    kind: "model",
    labId: "google",
    name: "Nano Banana",
    family: "Gemini Image",
    tier: "image",
    status: "ga",
    modalities: ["image"],
    releaseDate: "2026",
    summary:
      "Gemini 2.5 Flash Image — the fast, fun, lightweight image generation/editing model. Strong on quick edits, photo restoration, and character consistency.",
    highlights: ["= Gemini 2.5 Flash Image", "Fast lane: quick edits & casual creative work"],
    bestFor: [
      "Quick edits to an existing photo — cleanup, swaps, restoration",
      "Fast, low-cost iteration where speed beats maximum fidelity",
      "Keeping a character or subject consistent across several images",
    ],
    notIdealFor: [
      "Top-end photoreal stills for final delivery → Imagen 4 Ultra",
      "4K output or accurate text on posters/signage → Nano Banana Pro",
    ],
    useCases: [
      {
        title: "Fast photo fix",
        scenario:
          "Pull a distraction out of a venue shot, brighten a dim corner, or restore an old photo for a gallery — quick edits that don't justify a full retouch session.",
        why: "It's the fast lane: cheap, quick edits with solid results, ideal for the high-frequency small fixes that pile up around marketing content.",
      },
      {
        title: "Consistent subject set",
        scenario:
          "Generate a handful of images of the same person or mascot in different poses or settings for a brand's social feed.",
        why: "Strong character consistency keeps the subject recognisably the same across the set, which is the hard part of casual multi-image work.",
      },
    ],
    namingTheme: "🍌 'Nano Banana' — the playful fast lane of Gemini's image models.",
    api: {
      modelString: "nano-banana",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Image generation/editing call (Gemini 2.5 Flash Image): send a prompt, optionally with one or more input images to edit, and get image bytes back. Built for fast, cheap turnarounds — step up to Nano Banana Pro when you need 4K or legible text.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-nano-banana-pro",
    kind: "model",
    labId: "google",
    name: "Nano Banana Pro",
    family: "Gemini Image",
    tier: "image",
    status: "ga",
    modalities: ["image"],
    releaseDate: "2026",
    summary:
      "Gemini 3 Pro Image — the high-fidelity tier. Studio-quality control, up to 4K, advanced lighting/camera/focus, and best-in-class legible multilingual text rendering.",
    highlights: [
      "= Gemini 3 Pro Image",
      "Up to 4K; accurate text on posters, labels, signage",
      "Semantic/conversational editing; can pull real-world grounding via Search",
      "Reach for this when text accuracy or brand consistency matters",
    ],
    bestFor: [
      "Designs with real, legible text — posters, menus, signage, labels",
      "High-fidelity output up to 4K with studio lighting/camera/focus control",
      "Brand-consistent visuals you'll refine with conversational edits",
    ],
    notIdealFor: [
      "Throwaway quick edits where speed and cost matter most → Nano Banana",
      "Pure photoreal stills with no text or layout needs → Imagen 4 Ultra",
    ],
    useCases: [
      {
        title: "Poster with real text",
        scenario:
          "Produce an event poster or a café menu board where the Thai and English text has to be spelled correctly and laid out cleanly — not gibberish glyphs.",
        why: "Best-in-class legible multilingual text rendering is its standout; at up to 4K the result is print-ready rather than just a comp.",
      },
      {
        title: "Studio-grade brand image",
        scenario:
          "Craft a marketing visual with specific lighting, lens, and focus, then refine it by conversation until it matches the brand look across a set.",
        why: "Advanced lighting/camera/focus control plus semantic editing give the precision a brand needs, and Search grounding keeps real-world details accurate.",
      },
    ],
    namingTheme: "🍌 The 'Pro' quality lane of the Nano Banana family.",
    supersedes: "google-nano-banana",
    api: {
      modelString: "nano-banana-pro",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "High-fidelity image generation/editing call (Gemini 3 Pro Image): prompt plus optional input images, returns up to 4K bytes. Supports conversational editing turns and can ground details via Search — use it when text accuracy or brand control matters.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-lyria-3",
    kind: "model",
    labId: "google",
    name: "Lyria 3 / Lyria 3 Pro",
    family: "Lyria",
    tier: "music",
    status: "ga",
    modalities: ["music", "audio"],
    releaseDate: "2026",
    summary:
      "Google's flagship music generation models — turn text or image prompts into full tracks with instrumentals, vocals, and lyrics. Lyria 3 does ~30s clips; Lyria 3 Pro extends to 3-minute songs with full structure.",
    highlights: [
      "Lyria 3 Pro: up to 3-min tracks with intro/verse/chorus/bridge",
      "Available across Gemini app, AI Studio, Vertex AI, Google Vids",
      "All outputs carry SynthID watermarks",
    ],
    bestFor: [
      "Original background tracks for promo video or reels (no licence headache)",
      "Full structured songs up to 3 minutes — reach for Lyria 3 Pro",
      "Going from a text or image mood prompt straight to finished audio",
    ],
    notIdealFor: [
      "Live, hands-on performing and mixing of a set → MusicFX DJ",
      "Spoken dialogue or sound effects rather than music → Veo audio / a TTS model",
    ],
    useCases: [
      {
        title: "Reel background track",
        scenario:
          "Generate a 30-second instrumental bed in a defined mood for a venue's social clip, where licensing a real track would be a hassle.",
        why: "Text-to-music produces an original, watermarked track tuned to the brief, so the clip gets a fitting score without rights clearance.",
      },
      {
        title: "Full structured song",
        scenario:
          "Use Lyria 3 Pro to create a complete ~3-minute track with intro, verses, chorus, and bridge for a longer brand film or an event.",
        why: "Pro's full-song structure means you get a real arrangement rather than a loop, suitable for content that needs to breathe over minutes.",
      },
    ],
    namingTheme: "Lyria — from the lyre, the ancient stringed instrument.",
    api: {
      modelString: "lyria-3",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Music-generation call: send a text (or image) prompt, receive a watermarked audio track. Base 'lyria-3' returns ~30s clips; use the Pro variant for full ~3-minute structured songs. For live, interactive jamming use MusicFX DJ / Lyria RealTime instead.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-musicfx-dj",
    kind: "product",
    labId: "google",
    name: "MusicFX DJ",
    family: "Lyria",
    tier: "music",
    status: "ga",
    modalities: ["music", "audio"],
    releaseDate: "2026",
    summary:
      "A real-time, interactive music generator (powered by Lyria RealTime) you 'play like an instrument' — layer up to ten prompts and move faders to morph the sound instantly.",
    highlights: [
      "Faders for density, brightness, chaos; drums, bass, instruments",
      "Set BPM & key; continuous overlapping generation",
      "Free with no caps; sessions shareable as a URL",
    ],
    bestFor: [
      "Live, hands-on jamming where you steer the music in real time",
      "Improvising a mood or set on the fly by morphing layered prompts",
      "Free, uncapped experimentation you can share as a session URL",
    ],
    notIdealFor: [
      "A finished, fixed track to drop under a video → Lyria 3 / Lyria 3 Pro",
      "Structured songs with verses and choruses → Lyria 3 Pro",
    ],
    useCases: [
      {
        title: "Live mood jam",
        scenario:
          "Treat it like a DJ rig: layer drum, bass, and instrument prompts, set the BPM and key, then ride the faders to build and drop energy in real time.",
        why: "Continuous overlapping generation plus density/brightness/chaos faders make it feel like an instrument — the point is performing, not waiting on a render.",
      },
      {
        title: "Shareable session sketch",
        scenario:
          "Improvise a soundscape idea and send the session URL to a collaborator to pick up where you left off.",
        why: "It's free with no caps and sessions are shareable as a link, so it's a low-friction way to capture and hand off a musical sketch.",
      },
    ],
    api: {
      modelString: "musicfx-dj",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Real-time interactive music via Lyria RealTime: open a streaming session, push up to ten weighted prompts plus fader/BPM/key controls, and receive continuous audio you steer live. It's an interactive product (also free in the web app) rather than a one-shot render — for a fixed deliverable track use Lyria 3.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
  {
    id: "google-lumiere",
    kind: "model",
    labId: "google",
    name: "Google Lumiere",
    family: "Research",
    tier: "video",
    status: "research",
    modalities: ["video"],
    releaseDate: "2026",
    summary:
      "A DeepMind video-generation research model that processes a clip in a single pass for temporally consistent motion. Largely superseded by the Veo line for production use.",
    highlights: ["Research, not a shipping creator tool", "Single-pass temporal consistency"],
    bestFor: [
      "Following the research lineage behind today's video models",
      "Understanding single-pass temporal-consistency as an approach",
    ],
    notIdealFor: [
      "Any real promo or production video → Veo 3.1 (or Lite for drafts)",
      "Editing existing footage → Gemini Omni",
    ],
    useCases: [
      {
        title: "Research reference point",
        scenario:
          "Look to Lumiere to understand where Google's video generation came from and why single-pass temporal consistency mattered.",
        why: "It's a research-preview milestone, not a creator tool — useful for context, but the Veo line is what you actually ship with.",
      },
      {
        title: "Technique comparison",
        scenario:
          "Contrast Lumiere's single-pass approach with the controls and synchronised audio in Veo when deciding why the production tools work the way they do.",
        why: "Seeing the earlier research design clarifies the trade-offs the productised Veo models resolved.",
      },
    ],
    api: {
      modelString: "lumiere-research",
      sdkPackage: "@google/genai",
      envVar: "GEMINI_API_KEY",
      endpoint: "POST https://generativelanguage.googleapis.com/v1beta/models",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      note: "Research preview — not a generally-available API model. There's no stable public endpoint/model string to call for production; the slug here is a placeholder. For any real video work, call Veo 3.1 instead.",
    },
    provenance: {
      sourceUrl: "https://blog.google/technology/ai/",
      sourceLabel: "Google AI blog",
      confidence: "reported",
      lastVerified: V,
    },
  },
];
