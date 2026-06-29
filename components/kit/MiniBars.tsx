/**
 * Equalizer-style mini bar chart for a single benchmark score. Seven bars with
 * a fixed varied height pattern; the first N (proportional to score/max) are
 * filled in the lab accent, the rest sit muted. Pure / server-renderable.
 */
const HEIGHTS = [45, 70, 55, 95, 65, 85, 50]; // % of track height

export function MiniBars({ score, max = 100 }: { score: number; max?: number }) {
  const filled = Math.round((score / max) * HEIGHTS.length);
  return (
    <div className="flex h-7 items-end gap-[3px]" aria-hidden>
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="w-[5px] rounded-[1px]"
          style={{
            height: `${h}%`,
            background:
              i < filled ? "var(--lab-accent)" : "var(--color-edge-bright)",
          }}
        />
      ))}
    </div>
  );
}
