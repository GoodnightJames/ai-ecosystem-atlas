import type { Lab } from "@/data/types";

/** The "entertaining" layer: naming story + a few fun facts per lab. */
export function FunFacts({ lab }: { lab: Lab }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        className="rounded-lg border border-edge bg-surface p-4"
        style={{ boxShadow: "inset 3px 0 0 0 var(--lab-accent)" }}
      >
        <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden>✦</span> The naming convention
        </h3>
        <p className="text-sm leading-snug text-muted">{lab.namingStory}</p>
      </div>
      <div className="rounded-lg border border-edge bg-surface p-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden>💡</span> Did you know
        </h3>
        <ul className="flex flex-col gap-2">
          {lab.funFacts.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm leading-snug text-muted">
              <span style={{ color: "var(--lab-accent)" }} aria-hidden>
                ▸
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
