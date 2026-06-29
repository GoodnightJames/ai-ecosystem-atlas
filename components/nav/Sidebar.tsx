"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN = [
  { href: "/", label: "Overview", icon: "⌂" },
  { href: "/choose", label: "Help me choose", icon: "?" },
  { href: "/compare", label: "Compare", icon: "⇄" },
  { href: "/status", label: "Model Status", icon: "◑" },
  { href: "/timeline", label: "Timeline", icon: "◷" },
];

// Order + accents mirror the dashboard; accents resolved from the data theme.
const LABS = [
  { href: "/labs/openai", label: "OpenAI", accent: "#10a37f" },
  { href: "/labs/anthropic", label: "Anthropic", accent: "#d97757" },
  { href: "/labs/google", label: "Google", accent: "#4285f4" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-edge bg-canvas px-3 py-4 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 font-semibold tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/20 text-accent">
          ◎
        </span>
        <span className="text-sm leading-tight">AI&nbsp;Ecosystem&nbsp;Atlas</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {MAIN.map((l) => {
          const on = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                on
                  ? "bg-accent/12 font-medium text-ink"
                  : "text-muted hover:bg-raised hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className="w-4 text-center text-[13px]"
                style={{ color: on ? "var(--color-accent)" : "var(--color-subtle)" }}
              >
                {l.icon}
              </span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <p className="mb-1 mt-6 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
        Labs
      </p>
      <nav className="flex flex-col gap-0.5">
        {LABS.map((l) => {
          const on = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                on ? "bg-raised font-medium text-ink" : "text-muted hover:bg-raised hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: l.accent }}
              />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
