import type { ApiInfo, LabId } from "@/data/types";

/**
 * Build a minimal, runnable "how to call it" snippet from a model's ApiInfo.
 * One template per lab — so the code stays consistent and the only per-model
 * fact is the model-ID string (and SDK/env, which live in the data).
 *
 * These are intentionally the shortest thing that actually runs: install,
 * auth via env var, one request, print the text.
 */

export interface Snippet {
  language: string;
  /** Shell line to install the SDK (null when there's no package step). */
  install: string | null;
  code: string;
}

const ANTHROPIC = (a: ApiInfo): string =>
  `import Anthropic from "${a.sdkPackage}";

const client = new Anthropic(); // reads ${a.envVar}

const msg = await client.messages.create({
  model: "${a.modelString}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});

console.log(msg.content[0].text);`;

const OPENAI = (a: ApiInfo): string =>
  `import OpenAI from "${a.sdkPackage}";

const client = new OpenAI(); // reads ${a.envVar}

const res = await client.responses.create({
  model: "${a.modelString}",
  input: "Hello",
});

console.log(res.output_text);`;

const GOOGLE = (a: ApiInfo): string =>
  `import { GoogleGenAI } from "${a.sdkPackage}";

const ai = new GoogleGenAI({}); // reads ${a.envVar}

const res = await ai.models.generateContent({
  model: "${a.modelString}",
  contents: "Hello",
});

console.log(res.text);`;

const TEMPLATES: Record<LabId, (a: ApiInfo) => string> = {
  anthropic: ANTHROPIC,
  openai: OPENAI,
  google: GOOGLE,
};

export function buildSnippet(labId: LabId, api: ApiInfo): Snippet {
  return {
    language: "typescript",
    install: api.sdkPackage ? `npm install ${api.sdkPackage}` : null,
    code: TEMPLATES[labId](api),
  };
}
