/**
 * Shared export helpers so a plan copies/exports identically from /build and the
 * /plans library: the markdown body, a paste-ready coding-agent prompt, and a
 * download. Pure except downloadMarkdown (browser-only; called from client
 * handlers).
 */

export function planMarkdown(synthesis?: string | null, revisions?: string | null): string {
  const s = (synthesis ?? "").trim();
  return s + (revisions ? `\n\n## Red-team revisions\n${revisions}` : "");
}

export function agentPrompt(markdown: string): string {
  if (!markdown) return "";
  return `Implement the following plan in this repository. Work phase by phase; after each phase, run the build/tests and report before continuing. Ask before any destructive or irreversible action. Keep changes minimal and match existing conventions.

${markdown}`;
}

export function downloadMarkdown(text: string, filename: string): void {
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
