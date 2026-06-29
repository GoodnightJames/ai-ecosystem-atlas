/**
 * Deploy strip — mirrors the dashboard footer. Commit SHA comes from Vercel's
 * build env (inlined at build time); falls back to "local" off-platform.
 */
const COMMIT =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

export function SiteFooter() {
  return (
    <footer className="border-t border-edge px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-subtle">
        <span>
          Dated snapshot · June 2026. Availability shifts quickly — a point-in-time
          reference, not a permanent record.
        </span>
        <span className="font-mono">
          atlas · Vercel · jamesgoodnight-5247 · Commit: {COMMIT}
        </span>
      </div>
    </footer>
  );
}
