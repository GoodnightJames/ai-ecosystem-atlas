"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MOBILE_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/build", label: "Plan" },
  { href: "/plans", label: "Library" },
  { href: "/context", label: "Context" },
  { href: "/choose", label: "Choose" },
  { href: "/compare", label: "Compare" },
  { href: "/status", label: "Status" },
  { href: "/timeline", label: "Timeline" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 border-b border-edge bg-canvas/85 backdrop-blur">
      <div className="flex h-12 items-center gap-3 px-4 sm:px-6">
        {/* Brand — mobile only (sidebar carries it on desktop) */}
        <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
          <span className="grid h-6 w-6 place-items-center rounded bg-accent/20 text-accent">
            ◎
          </span>
          <span className="text-sm">Atlas</span>
        </Link>

        {/* Freshness pill */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-subtle sm:inline">Freshness:</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              color: "var(--color-go)",
              background: "color-mix(in srgb, var(--color-go) 14%, transparent)",
            }}
          >
            <span className="pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-go)" }} aria-hidden />
            LIVE · JUN 2026
          </span>
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="flex gap-1 overflow-x-auto border-t border-edge px-3 py-1.5 md:hidden">
        {MOBILE_LINKS.map((l) => {
          const on = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded px-2.5 py-1 text-xs ${
                on ? "bg-accent/12 text-ink" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
