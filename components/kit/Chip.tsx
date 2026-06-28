import type { ReactNode } from "react";

/** A tinted-ring tag — borrowed technique: faint fill + colored ring. */
export function Chip({
  children,
  color = "var(--color-accent)",
  title,
}: {
  children: ReactNode;
  color?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}
