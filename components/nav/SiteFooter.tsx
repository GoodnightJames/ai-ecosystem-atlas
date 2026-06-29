/**
 * Deploy strip — mirrors the dashboard footer. Commit SHA is inlined at build
 * time: NEXT_PUBLIC_ATLAS_COMMIT (passed on CLI deploys) takes precedence, then
 * Vercel's git SHA (git-connected deploys), else "local". `|| ""` guards against
 * the empty-string the CLI sets for VERCEL_GIT_COMMIT_SHA.
 */
const COMMIT =
  (process.env.NEXT_PUBLIC_ATLAS_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(
    0,
    7,
  );

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
