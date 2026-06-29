"use client";

import { useState } from "react";

/** Small clipboard button with a transient "Copied" state. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="rounded-md border border-edge px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}
