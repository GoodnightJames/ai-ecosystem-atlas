import type { ReactNode } from "react";

/**
 * Minimal, dependency-free markdown renderer — enough for model-authored plans:
 * headings, bullet/numbered lists, bold, inline code, and paragraphs. Not a full
 * CommonMark parser; deliberately small.
 */

function inline(text: string, keyBase: string): ReactNode[] {
  // Split on **bold** and `code`, keeping delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    const key = `${keyBase}-${i}`;
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-ink">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-raised px-1 py-0.5 font-mono text-[0.85em] text-ink">
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{p}</span>;
  });
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let k = 0;

  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => (
      <li key={i} className="leading-relaxed">
        {inline(it, `li-${k}-${i}`)}
      </li>
    ));
    out.push(
      list.ordered ? (
        <ol key={`l-${k++}`} className="ml-5 list-decimal space-y-1 text-muted">
          {items}
        </ol>
      ) : (
        <ul key={`l-${k++}`} className="ml-5 list-disc space-y-1 text-muted">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      const lvl = h[1].length;
      const cls =
        lvl <= 1
          ? "mt-4 text-lg font-bold text-ink"
          : lvl === 2
            ? "mt-4 text-base font-semibold text-ink"
            : "mt-3 text-sm font-semibold uppercase tracking-wide text-subtle";
      out.push(
        <p key={`h-${k++}`} className={cls}>
          {inline(h[2], `h-${k}`)}
        </p>,
      );
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ul) {
      if (!list || list.ordered) {
        flush();
        list = { ordered: false, items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    if (ol) {
      if (!list || !list.ordered) {
        flush();
        list = { ordered: true, items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    flush();
    out.push(
      <p key={`p-${k++}`} className="leading-relaxed text-muted">
        {inline(line, `p-${k}`)}
      </p>,
    );
  }
  flush();

  return <div className="flex flex-col gap-2 text-sm">{out}</div>;
}
