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

async function askAnthropic(idea: string, model: string): Promise<string> {
  const client = new Anthropic();
  const msg = await client.messages.create({
    model,
    max_tokens: 3000,
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
    max_output_tokens: 3000,
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
    max_tokens: 3500,
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

export async function runCouncil(idea: string): Promise<CouncilResult> {
  const members = configuredMembers();
  if (members.length === 0) {
    throw new Error(
      "No council members configured. Set ANTHROPIC_API_KEY (and optionally OPENAI_API_KEY + COUNCIL_OPENAI_MODEL, GEMINI_API_KEY + COUNCIL_GOOGLE_MODEL).",
    );
  }

  const settled = await Promise.allSettled(
    members.map((m) => callMember(idea, m)),
  );
  const results: MemberResult[] = members.map((m, i) => {
    const s = settled[i];
    if (s.status === "fulfilled" && s.value) {
      return { ...m, plan: s.value };
    }
    const reason =
      s.status === "rejected"
        ? s.reason instanceof Error
          ? s.reason.message
          : String(s.reason)
        : "Empty response.";
    return { ...m, plan: null, error: reason };
  });

  let synthesis: string | null = null;
  let synthesisError: string | undefined;
  if (results.some((r) => r.plan)) {
    try {
      synthesis = await synthesize(idea, results);
    } catch (e) {
      synthesisError = e instanceof Error ? e.message : "Synthesis failed.";
    }
  } else {
    synthesisError = "Every council member failed — nothing to synthesize.";
  }

  return { members: results, synthesis, synthesisError };
}
