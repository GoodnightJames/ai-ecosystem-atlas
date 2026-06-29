"use client";

import { useState } from "react";

/**
 * A mono code panel with a copy button. Client component because of the
 * clipboard interaction + transient "Copied" state — everything else on the
 * page stays a static server component.
 */
export function CodeBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-[#0c1120]">
      <div className="flex items-center justify-between border-b border-edge px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-subtle">
          {label ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-0.5 text-[11px] font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-live="polite"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[12.5px] leading-relaxed">
        <code className="font-mono text-ink">{code}</code>
      </pre>
    </div>
  );
}
