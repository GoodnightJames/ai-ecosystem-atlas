import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

/**
 * The live "model council": fan a project idea out to whichever real GA models
 * are configured (via env), then synthesize their plans with Claude.
 *
 * IMPORTANT: the model IDs here are REAL, currently-callable ones — NOT the
 * speculative June-2026 IDs in data/models.ts. Anthropic defaults to the real
 * `claude-opus-4-8`; OpenAI/Google participate only if you set both their API
 * key AND a model ID env var (so we never call a guessed/wrong model string).
 */

export type Provider = "anthropic" | "openai" | "google";

export interface Member {
  provider: Provider;
  label: string;
  model: string;
}

export interface MemberResult extends Member {
  plan: string | null;
  error?: string;
}

export interface CouncilResult {
  members: MemberResult[];
  synthesis: string | null;
  synthesisError?: string;
}

/** Which providers are usable given the configured env (no secrets leaked). */
export function configuredMembers(): Member[] {
  const members: Member[] = [];
  if (process.env.ANTHROPIC_API_KEY) {
    members.push({
      provider: "anthropic",
      label: "Anthropic Claude",
      model: process.env.COUNCIL_ANTHROPIC_MODEL || "claude-opus-4-8",
    });
  }
  // OpenAI / Google need an explicit model env — their real IDs aren't safe to
  // guess, and the catalogue's are fictional.
  if (process.env.OPENAI_API_KEY && process.env.COUNCIL_OPENAI_MODEL) {
    members.push({
      provider: "openai",
      label: "OpenAI GPT",
      model: process.env.COUNCIL_OPENAI_MODEL,
    });
  }
  if (process.env.GEMINI_API_KEY && process.env.COUNCIL_GOOGLE_MODEL) {
    members.push({
      provider: "google",
      label: "Google Gemini",
      model: process.env.COUNCIL_GOOGLE_MODEL,
    });
  }
  return members;
}

const planPrompt = (idea: string) =>
  `You are a pragmatic principal engineer. A builder describes a project or idea below. Produce a concise, opinionated build plan.

Cover: the recommended stack/approach, 3–5 phased milestones, the top risks or unknowns, and — if the project involves AI features — which model(s)/APIs you'd use and why. Be specific and decisive; if you'd push back on the idea, say so briefly. Markdown, ~300–450 words. Respond with the plan only.

PROJECT IDEA:
${idea}`;

/** Cut a hung provider call loose so the whole serverless invocation can still
 * return before Vercel's wall-clock limit (60s on Hobby). The underlying request
 * keeps running but we stop waiting on it. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} took longer than ${ms / 1000}s`)), ms),
    ),
  ]);
}

const CALL_TIMEOUT_MS = 50_000;

async function askAnthropic(idea: string, model: string): Promise<string> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model,
    max_tokens: 2000,
    messages: [{ role: "user", content: planPrompt(idea) }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

async function askOpenAI(idea: string, model: string): Promise<string> {
  const client = new OpenAI();
  const res = await client.responses.create({
    model,
    input: planPrompt(idea),
    max_output_tokens: 2000,
  });
  return (res.output_text ?? "").trim();
}

async function askGoogle(idea: string, model: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const res = await ai.models.generateContent({
    model,
    contents: planPrompt(idea),
  });
  return (res.text ?? "").trim();
}

function callMember(idea: string, m: Member): Promise<string> {
  switch (m.provider) {
    case "anthropic":
      return askAnthropic(idea, m.model);
    case "openai":
      return askOpenAI(idea, m.model);
    case "google":
      return askGoogle(idea, m.model);
  }
}

async function synthesize(
  idea: string,
  results: MemberResult[],
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Synthesis needs ANTHROPIC_API_KEY.");
  }
  const ok = results.filter((r) => r.plan);
  const blocks = ok
    .map((r) => `### Plan from ${r.label} (${r.model})\n${r.plan}`)
    .join("\n\n---\n\n");

  const client = new Anthropic();
  const msg = await client.messages.create({
    model: process.env.COUNCIL_ANTHROPIC_MODEL || "claude-opus-4-8",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `${ok.length} AI models each proposed a build plan for the SAME project idea. Synthesize them into ONE recommended implementation plan.

Structure your answer:
1. **Recommended plan** — the single best path, phased, drawing the strongest ideas from across the proposals.
2. **Where they agreed** — the consensus worth trusting.
3. **Where they diverged** — the real decisions, with your call on each.
4. **If warranted, one alternative plan** — only if a genuinely different approach is defensible.

Be decisive — you're the deciding architect, not a summarizer. Markdown.

PROJECT IDEA:
${idea}

THE PROPOSALS:
${blocks}`,
      },
    ],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/**
 * PHASE 1 — ask every configured model in parallel (each with its own timeout so
 * one slow model can't blow the serverless budget). One HTTP round on its own.
 */
export async function proposePlans(idea: string): Promise<MemberResult[]> {
  const members = configuredMembers();
  if (members.length === 0) {
    throw new Error(
      "No council members configured. Set ANTHROPIC_API_KEY (and optionally OPENAI_API_KEY + COUNCIL_OPENAI_MODEL, GEMINI_API_KEY + COUNCIL_GOOGLE_MODEL).",
    );
  }
  const settled = await Promise.allSettled(
    members.map((m) => withTimeout(callMember(idea, m), CALL_TIMEOUT_MS, m.label)),
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

/**
 * PHASE 2 — merge the proposals with Claude. A separate HTTP round so each stays
 * under the function time limit.
 */
export async function synthesizePlans(
  idea: string,
  members: MemberResult[],
): Promise<{ synthesis: string | null; synthesisError?: string }> {
  if (!members.some((r) => r.plan)) {
    return { synthesis: null, synthesisError: "Nothing to synthesize — every member failed." };
  }
  try {
    const synthesis = await withTimeout(synthesize(idea, members), CALL_TIMEOUT_MS, "Synthesis");
    return { synthesis };
  } catch (e) {
    return { synthesis: null, synthesisError: e instanceof Error ? e.message : "Synthesis failed." };
  }
}

/** One-shot (both phases) — fine for short ideas / direct API use; the UI splits
 * the two phases to stay under the serverless time limit on richer ideas. */
export async function runCouncil(idea: string): Promise<CouncilResult> {
  const members = await proposePlans(idea);
  const { synthesis, synthesisError } = await synthesizePlans(idea, members);
  return { members, synthesis, synthesisError };
}
