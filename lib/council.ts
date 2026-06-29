import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { models } from "@/data";

/**
 * The live "model council": fan a project idea out to whichever real GA models
 * are configured (via env), each with a DISTINCT lens, then synthesize with
 * Claude, then red-team-and-revise with a different model.
 *
 * Pipeline (each phase is its own HTTP round so every serverless invocation
 * stays under the Vercel time limit):
 *   1. propose   — every member proposes, under its assigned lens
 *   2. synthesize— Claude merges into one plan + flags divergences
 *   3. critique  — a DIFFERENT model red-teams the synthesis and outputs a
 *                  hardened final plan
 *
 * Model IDs are REAL, currently-callable ones — NOT the speculative June-2026
 * IDs in data/models.ts. Anthropic defaults to real `claude-opus-4-8`;
 * OpenAI/Google join only if their key AND a model-id env var are set.
 */

export type Provider = "anthropic" | "openai" | "google";

export interface Member {
  provider: Provider;
  label: string;
  model: string;
  lens?: string; // human label of the assigned lens
}
export interface MemberResult extends Member {
  plan: string | null;
  error?: string;
}
export interface CritiqueResult {
  critic: string;
  critique: string;
  finalPlan: string | null;
  error?: string;
}
export interface CouncilResult {
  members: MemberResult[];
  synthesis: string | null;
  synthesisError?: string;
}

// ── Personalization: who's building, so plans fit the real toolkit ──────────
const BUILDER_PROFILE = `BUILDER CONTEXT: A solo builder who ships with Next.js (App Router) + Tailwind CSS + Sanity, hosts on Vercel (and Railway for Node services), writes strict TypeScript, and implements with an AI coding agent (Claude Code). Strong preference for cheap, low-maintenance, minimal-infrastructure solutions. Tailor stack choices to this unless the project clearly needs otherwise.`;

// ── Lenses: distinct briefs so members diverge instead of converging ────────
const LENSES = [
  {
    label: "Ship-fast",
    instruction:
      "Optimize for the cheapest, simplest thing that ships fast — managed services, minimal moving parts, least code.",
  },
  {
    label: "Robust",
    instruction:
      "Optimize for robustness, correctness, and scale — name the failure modes and how the design handles them.",
  },
  {
    label: "Skeptic",
    instruction:
      "Be the skeptic. Challenge the premise, surface the biggest risks and what could go wrong, and say where a simpler or fundamentally different approach beats the obvious one.",
  },
];

/** Which providers are usable given the configured env, each with a lens. */
export function configuredMembers(): Member[] {
  const members: Member[] = [];
  if (process.env.ANTHROPIC_API_KEY) {
    members.push({
      provider: "anthropic",
      label: "Anthropic Claude",
      model: process.env.COUNCIL_ANTHROPIC_MODEL || "claude-opus-4-8",
    });
  }
  if (process.env.OPENAI_API_KEY && process.env.COUNCIL_OPENAI_MODEL) {
    members.push({ provider: "openai", label: "OpenAI GPT", model: process.env.COUNCIL_OPENAI_MODEL });
  }
  if (process.env.GEMINI_API_KEY && process.env.COUNCIL_GOOGLE_MODEL) {
    members.push({ provider: "google", label: "Google Gemini", model: process.env.COUNCIL_GOOGLE_MODEL });
  }
  // Assign a distinct lens per member (round-robin). With one member, no lens.
  if (members.length > 1) {
    members.forEach((m, i) => {
      m.lens = LENSES[i % LENSES.length].label;
    });
  }
  return members;
}

/** Compact catalogue digest so plans name real (catalogue) models, not stale ones. */
function modelDigest(): string {
  return models
    .filter((m) => m.status === "ga")
    .map((m) => {
      const p =
        m.pricing && m.pricing.inputPerMTok != null
          ? `$${m.pricing.inputPerMTok}/$${m.pricing.outputPerMTok} per Mtok`
          : "—";
      return `- ${m.name} (${m.labId}, ${m.tier}; ${p}): ${m.bestFor?.[0] ?? m.summary}`;
    })
    .join("\n");
}

function lensInstruction(label?: string): string {
  return label ? ` ${LENSES.find((l) => l.label === label)?.instruction ?? ""}` : "";
}

const planPrompt = (idea: string, lens?: string) =>
  `You are a pragmatic principal engineer.${lensInstruction(lens)}

${BUILDER_PROFILE}

When recommending AI models/APIs, prefer these current options from the builder's catalogue and name them specifically:
${modelDigest()}

A builder describes a project below. Produce a concise, opinionated build plan: recommended stack/approach, 3–5 phased milestones, the top risks/unknowns, and which model(s)/APIs to use for any AI features. Be specific and decisive. Markdown, ~300–450 words. Respond with the plan only.

PROJECT IDEA:
${idea}`;

const CALL_TIMEOUT_MS = 50_000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} took longer than ${ms / 1000}s`)), ms),
    ),
  ]);
}

// ── Generic provider calls (take a finished prompt) ─────────────────────────
async function askAnthropic(prompt: string, model: string, maxTokens: number): Promise<string> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
async function askOpenAI(prompt: string, model: string, maxTokens: number): Promise<string> {
  const client = new OpenAI();
  const res = await client.responses.create({ model, input: prompt, max_output_tokens: maxTokens });
  return (res.output_text ?? "").trim();
}
async function askGoogle(prompt: string, model: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const res = await ai.models.generateContent({ model, contents: prompt });
  return (res.text ?? "").trim();
}
function callProvider(provider: Provider, prompt: string, model: string, maxTokens = 2000): Promise<string> {
  switch (provider) {
    case "anthropic":
      return askAnthropic(prompt, model, maxTokens);
    case "openai":
      return askOpenAI(prompt, model, maxTokens);
    case "google":
      return askGoogle(prompt, model);
  }
}

// ── Phase 1 — propose ───────────────────────────────────────────────────────
export async function proposePlans(idea: string): Promise<MemberResult[]> {
  const members = configuredMembers();
  if (members.length === 0) {
    throw new Error(
      "No council members configured. Set ANTHROPIC_API_KEY (and optionally OPENAI_API_KEY + COUNCIL_OPENAI_MODEL, GEMINI_API_KEY + COUNCIL_GOOGLE_MODEL).",
    );
  }
  const settled = await Promise.allSettled(
    members.map((m) => withTimeout(callProvider(m.provider, planPrompt(idea, m.lens), m.model), CALL_TIMEOUT_MS, m.label)),
  );
  return members.map((m, i): MemberResult => {
    const s = settled[i];
    if (s.status === "fulfilled" && s.value) return { ...m, plan: s.value };
    const reason =
      s.status === "rejected"
        ? s.reason instanceof Error
          ? s.reason.message
          : String(s.reason)
        : "Empty response.";
    return { ...m, plan: null, error: reason };
  });
}

// ── Phase 2 — synthesize (Claude) ───────────────────────────────────────────
async function synthesize(idea: string, members: MemberResult[]): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Synthesis needs ANTHROPIC_API_KEY.");
  const ok = members.filter((r) => r.plan);
  const blocks = ok
    .map((r) => `### Plan from ${r.label}${r.lens ? ` (lens: ${r.lens})` : ""} — ${r.model}\n${r.plan}`)
    .join("\n\n---\n\n");
  const prompt = `${ok.length} AI models each proposed a build plan for the SAME project idea, each under a different lens. Synthesize them into ONE recommended implementation plan.

Structure:
1. **Recommended plan** — the single best path, phased, drawing the strongest ideas across proposals.
2. **Where they agreed** — the consensus worth trusting.
3. **Where they diverged** — the real decisions, with your call on each.
4. **Alternative plan** — only if a genuinely different approach is defensible.

Be decisive — you're the deciding architect, not a summarizer. Markdown.

${BUILDER_PROFILE}

PROJECT IDEA:
${idea}

THE PROPOSALS:
${blocks}`;
  return askAnthropic(prompt, process.env.COUNCIL_ANTHROPIC_MODEL || "claude-opus-4-8", 3000);
}

export async function synthesizePlans(
  idea: string,
  members: MemberResult[],
): Promise<{ synthesis: string | null; synthesisError?: string }> {
  if (!members.some((r) => r.plan)) {
    return { synthesis: null, synthesisError: "Nothing to synthesize — every member failed." };
  }
  try {
    return { synthesis: await withTimeout(synthesize(idea, members), CALL_TIMEOUT_MS, "Synthesis") };
  } catch (e) {
    return { synthesis: null, synthesisError: e instanceof Error ? e.message : "Synthesis failed." };
  }
}

// ── Phase 3 — red-team & revise (a DIFFERENT model than the synthesizer) ─────
const FINAL_MARKER = "## Final plan";

export async function critiquePlan(idea: string, synthesis: string): Promise<CritiqueResult> {
  const cm = configuredMembers();
  // Prefer a non-Anthropic critic (the synthesizer is Anthropic) for real diversity.
  const critic = cm.find((m) => m.provider !== "anthropic") ?? cm[0];
  if (!critic) return { critic: "—", critique: "", finalPlan: null, error: "No critic configured." };

  const prompt = `You are a senior engineer doing a red-team review of a build plan. Be adversarial but fair.

First, critique the plan: what's missing, wrong, over-engineered, or genuinely risky? 3–6 sharp bullets.
Then output an improved FINAL plan that fixes those issues — same decisive, phased structure.

Format your answer EXACTLY like this, with these two headings:
## Red-team notes
- ...
${FINAL_MARKER}
<the improved, hardened plan in markdown>

${BUILDER_PROFILE}

PROJECT IDEA:
${idea}

PLAN TO REVIEW:
${synthesis}`;

  try {
    const text = await withTimeout(
      callProvider(critic.provider, prompt, critic.model, 3000),
      CALL_TIMEOUT_MS,
      "Critique",
    );
    const idx = text.indexOf(FINAL_MARKER);
    if (idx === -1) {
      return { critic: `${critic.label} · ${critic.model}`, critique: "", finalPlan: text };
    }
    const critique = text.slice(0, idx).replace(/^##\s*Red-team notes\s*/i, "").trim();
    const finalPlan = text.slice(idx + FINAL_MARKER.length).trim();
    return { critic: `${critic.label} · ${critic.model}`, critique, finalPlan };
  } catch (e) {
    return {
      critic: `${critic.label} · ${critic.model}`,
      critique: "",
      finalPlan: null,
      error: e instanceof Error ? e.message : "Critique failed.",
    };
  }
}
