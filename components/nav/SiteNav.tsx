import Link from "next/link";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/compare", label: "Compare" },
  { href: "/status", label: "Status Board" },
  { href: "/timeline", label: "Timeline" },
];

const LABS = [
  { href: "/labs/anthropic", label: "Anthropic" },
  { href: "/labs/openai", label: "OpenAI" },
  { href: "/labs/google", label: "Google" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-canvas/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/20 text-accent">◎</span>
          <span>AI&nbsp;Ecosystem&nbsp;Atlas</span>
        </Link>
        <span className="hidden h-4 w-px bg-edge sm:inline-block" />
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="ml-auto flex items-center gap-x-3 text-xs text-subtle">
          {LABS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
