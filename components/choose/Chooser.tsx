"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusDot } from "@/components/kit/StatusDot";
import type { Status } from "@/data/types";
import type { Rank } from "@/lib/recommend";
import { RANK_LABEL } from "@/lib/recommend";

export interface ResolvedPick {
  modelId: string;
  rank: Rank;
  why: string;
  name: string;
  labName: string;
  labId: string;
  status: Status;
  statusLabel: string;
  tone: "go" | "warn" | "stop" | "muted";
  price: string;
  /** Lab accent hex, resolved server-side. */
  accent: string;
}

export interface ResolvedArchetype {
  id: string;
  icon: string;
  label: string;
  blurb: string;
  picks: ResolvedPick[];
}

const TONE_VAR: Record<string, string> = {
  go: "var(--color-go)",
  warn: "var(--color-warn)",
  stop: "var(--color-stop)",
  muted: "var(--color-mutedstatus)",
};

const RANK_TONE: Record<Rank, string> = {
  primary: "var(--lab-accent)",
  budget: "var(--color-go)",
  alt: "var(--color-subtle)",
};

export function Chooser({ tasks }: { tasks: ResolvedArchetype[] }) {
  const [activeId, setActiveId] = useState(tasks[0]?.id);
  const active = tasks.find((t) => t.id === activeId) ?? tasks[0];

  return (
    <div className="mt-8">
      {/* Task picker */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {tasks.map((t) => {
          const on = t.id === active.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                on
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-edge bg-surface text-muted hover:border-edge-bright hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className="text-base"
                style={{ color: on ? "var(--color-accent)" : "var(--color-subtle)" }}
              >
                {t.icon}
              </span>
              <span className="font-medium leading-tight">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result */}
      <div className="mt-7">
        <p className="text-sm text-subtle">{active.blurb}</p>
        <div className="mt-4 flex flex-col gap-3">
          {active.picks.map((p) => (
            <Link
              key={p.modelId}
              href={`/models/${p.modelId}`}
              style={{ ["--lab-accent" as string]: p.accent }}
              className="group block rounded-xl border border-edge bg-surface p-4 transition-colors hover:border-edge-bright"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    color: RANK_TONE[p.rank],
                    background: `color-mix(in srgb, ${RANK_TONE[p.rank]} 14%, transparent)`,
                  }}
                >
                  {RANK_LABEL[p.rank]}
                </span>
                <span className="text-base font-semibold text-ink group-hover:underline">
                  {p.name}
                </span>
                <span className="text-xs text-subtle">{p.labName}</span>
                <span
                  className="ml-auto inline-flex items-center gap-1 text-xs"
                  style={{ color: TONE_VAR[p.tone] }}
                >
                  <StatusDot status={p.status} />
                  {p.statusLabel}
                </span>
              </div>
              <p className="mt-2 text-sm leading-snug text-muted">{p.why}</p>
              <p className="mt-1.5 font-mono text-xs text-subtle">{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
