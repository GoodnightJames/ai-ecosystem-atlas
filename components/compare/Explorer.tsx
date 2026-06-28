"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { models as ALL, getLab } from "@/data";
import {
  LAB_IDS,
  MODALITIES,
  STATUSES,
  TIERS,
  type LabId,
  type Modality,
  type Model,
  type Status,
  type Tier,
} from "@/data/types";
import {
  applyFilters,
  EMPTY_FILTERS,
  type FilterState,
  type SortKey,
} from "@/lib/filtering";
import {
  STATUS_META,
  formatContext,
  formatDate,
  formatPricing,
  titleCase,
} from "@/lib/format";
import { StatusDot } from "@/components/kit/StatusDot";
import { Chip } from "@/components/kit/Chip";
import { labStyle } from "@/lib/theme";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "lab", label: "By lab" },
  { key: "name", label: "Name A–Z" },
  { key: "release-newest", label: "Newest first" },
  { key: "release-oldest", label: "Oldest first" },
  { key: "price-low", label: "Cheapest input" },
  { key: "price-high", label: "Priciest input" },
];

const MAX_COMPARE = 4;

/** A toggle-chip group for one filter dimension. */
function ToggleGroup<T extends string>({
  options,
  selected,
  onToggle,
  colorFor,
  labelFor,
}: {
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
  colorFor?: (v: T) => string;
  labelFor?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const on = selected.includes(opt);
        const color = colorFor?.(opt) ?? "var(--color-accent)";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
            style={{
              color: on ? color : "var(--color-muted)",
              background: on ? `color-mix(in srgb, ${color} 16%, transparent)` : "transparent",
              boxShadow: on
                ? `inset 0 0 0 1px color-mix(in srgb, ${color} 45%, transparent)`
                : "inset 0 0 0 1px var(--color-edge)",
            }}
          >
            {labelFor?.(opt) ?? titleCase(opt)}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_COLOR = (s: Status) => {
  const t = STATUS_META[s].tone;
  return t === "go"
    ? "var(--color-go)"
    : t === "warn"
      ? "var(--color-warn)"
      : t === "stop"
        ? "var(--color-stop)"
        : "var(--color-mutedstatus)";
};

export function Explorer() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("lab");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const results = useMemo(() => applyFilters(ALL, filters, sort), [filters, sort]);
  const compareModels = compareIds
    .map((id) => ALL.find((m) => m.id === id))
    .filter((m): m is Model => Boolean(m));

  const toggle = <K extends "labs" | "statuses" | "tiers" | "modalities">(
    key: K,
    value: FilterState[K][number],
  ) =>
    setFilters((f) => {
      const arr = f[key] as string[];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...f, [key]: next };
    });

  const toggleCompare = (id: string) =>
    setCompareIds((ids) =>
      ids.includes(id)
        ? ids.filter((x) => x !== id)
        : ids.length >= MAX_COMPARE
          ? ids
          : [...ids, id],
    );

  const activeFilters =
    filters.labs.length +
    filters.statuses.length +
    filters.tiers.length +
    filters.modalities.length +
    (filters.query ? 1 : 0);

  // cheapest published input price among compared models → "price showdown"
  const cheapest = compareModels.reduce<number | null>((min, m) => {
    const p = m.pricing?.inputPerMTok;
    if (p == null) return min;
    return min == null ? p : Math.min(min, p);
  }, null);

  return (
    <div className="pb-32">
      {/* Controls */}
      <div className="sticky top-[57px] z-20 -mx-4 mb-6 border-b border-edge bg-canvas/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search models, specs, highlights…"
              className="min-w-[12rem] flex-1 rounded-lg border border-edge bg-surface px-3 py-2 text-sm outline-none placeholder:text-subtle focus:border-edge-bright"
            />
            <label className="flex items-center gap-2 text-xs text-muted">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-edge bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-edge-bright"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-lg border border-edge px-2.5 py-2 text-xs text-muted hover:text-ink"
              >
                Clear ({activeFilters})
              </button>
            )}
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-subtle">Lab</p>
              <ToggleGroup
                options={LAB_IDS}
                selected={filters.labs}
                onToggle={(v: LabId) => toggle("labs", v)}
                colorFor={(v) => getLab(v)?.theme.accent ?? "var(--color-accent)"}
                labelFor={(v) => getLab(v)?.name ?? v}
              />
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-subtle">Status</p>
              <ToggleGroup
                options={STATUSES}
                selected={filters.statuses}
                onToggle={(v: Status) => toggle("statuses", v)}
                colorFor={STATUS_COLOR}
                labelFor={(v) => STATUS_META[v].label}
              />
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-subtle">Tier</p>
              <ToggleGroup
                options={TIERS}
                selected={filters.tiers}
                onToggle={(v: Tier) => toggle("tiers", v)}
              />
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-subtle">Modality</p>
              <ToggleGroup
                options={MODALITIES}
                selected={filters.modalities}
                onToggle={(v: Modality) => toggle("modalities", v)}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mb-3 text-sm text-subtle">
        <span className="font-semibold text-ink tabular-nums">{results.length}</span> of {ALL.length}{" "}
        models · tick up to {MAX_COMPARE} to compare
      </p>

      {/* Results grid */}
      {results.length === 0 ? (
        <p className="rounded-lg border border-dashed border-edge p-8 text-center text-muted">
          No models match those filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((m) => {
            const lab = getLab(m.labId);
            const selected = compareIds.includes(m.id);
            const atMax = compareIds.length >= MAX_COMPARE && !selected;
            return (
              <div
                key={m.id}
                style={labStyle(m.labId)}
                className="relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-surface p-4 transition-colors"
              >
                <span
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: "var(--lab-accent)" }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/models/${m.id}`}
                      className="font-semibold leading-tight tracking-tight hover:underline"
                    >
                      {m.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle">{lab?.name}</p>
                  </div>
                  <label
                    className={`flex shrink-0 cursor-pointer items-center gap-1 text-[11px] ${
                      atMax ? "cursor-not-allowed opacity-40" : ""
                    }`}
                    title={atMax ? `Max ${MAX_COMPARE} selected` : "Add to compare"}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={atMax}
                      onChange={() => toggleCompare(m.id)}
                      className="accent-[var(--color-accent)]"
                    />
                    compare
                  </label>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted">{m.summary}</p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: STATUS_COLOR(m.status) }}>
                    <StatusDot status={m.status} />
                    {STATUS_META[m.status].label}
                  </span>
                  <Chip>{titleCase(m.tier)}</Chip>
                  {m.contextWindow ? <Chip color="var(--color-muted)">{formatContext(m.contextWindow)} ctx</Chip> : null}
                  {m.pricing && (m.pricing.inputPerMTok != null || m.pricing.note) ? (
                    <Chip color="var(--color-accent-2)">{formatPricing(m.pricing)}</Chip>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare tray */}
      {compareModels.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-edge bg-surface/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                Compare <span className="text-subtle">({compareModels.length})</span>
                {cheapest != null && (
                  <span className="ml-2 text-xs font-normal text-subtle">
                    💸 cheapest input: ${cheapest}/1M
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-muted hover:text-ink"
              >
                Clear all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-xs">
                <thead className="text-subtle">
                  <tr>
                    <th className="py-1 pr-3 font-medium">Model</th>
                    <th className="py-1 pr-3 font-medium">Status</th>
                    <th className="py-1 pr-3 font-medium">Context</th>
                    <th className="py-1 pr-3 font-medium">Price in/out</th>
                    <th className="py-1 pr-3 font-medium">Released</th>
                    <th className="py-1 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {compareModels.map((m) => {
                    const isCheap =
                      cheapest != null && m.pricing?.inputPerMTok === cheapest;
                    return (
                      <tr key={m.id} className="border-t border-edge/60" style={labStyle(m.labId)}>
                        <td className="py-1.5 pr-3">
                          <Link href={`/models/${m.id}`} className="font-medium hover:underline" style={{ color: "var(--lab-accent)" }}>
                            {m.name}
                          </Link>
                        </td>
                        <td className="py-1.5 pr-3">
                          <span className="inline-flex items-center gap-1" style={{ color: STATUS_COLOR(m.status) }}>
                            <StatusDot status={m.status} size={7} />
                            {STATUS_META[m.status].label}
                          </span>
                        </td>
                        <td className="py-1.5 pr-3 tabular-nums">{formatContext(m.contextWindow)}</td>
                        <td className="py-1.5 pr-3 tabular-nums">
                          {formatPricing(m.pricing)}
                          {isCheap && <span className="ml-1" title="cheapest input">💸</span>}
                        </td>
                        <td className="py-1.5 pr-3 tabular-nums">{formatDate(m.releaseDate)}</td>
                        <td className="py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => toggleCompare(m.id)}
                            className="text-subtle hover:text-ink"
                            aria-label={`Remove ${m.name}`}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
