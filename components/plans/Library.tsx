"use client";

import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/kit/Markdown";

interface Summary {
  id: string;
  project: string;
  title: string;
  createdAt: number;
}
interface MemberResult {
  provider: string;
  label: string;
  model: string;
  lens?: string;
  plan: string | null;
  error?: string;
}
interface FullPlan extends Summary {
  idea: string;
  members: MemberResult[] | null;
  synth: { synthesis: string | null } | null;
  critique: { critic: string; critique: string; revisions: string | null } | null;
}

const PASSCODE_KEY = "council-passcode";

export function Library() {
  const [passcode, setPasscode] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [open, setOpen] = useState<FullPlan | null>(null);

  const load = useCallback(async (pass: string) => {
    if (!pass) return;
    setError(null);
    try {
      const r = await fetch("/api/plans", { headers: { "x-council-passcode": pass } });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? `Failed (${r.status}).`);
        setSummaries([]);
      } else {
        setSummaries(d.plans ?? []);
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const p = localStorage.getItem(PASSCODE_KEY) ?? "";
    setPasscode(p);
    if (p) load(p);
    else setLoaded(true);
  }, [load]);

  async function openPlan(id: string) {
    const r = await fetch(`/api/plans?id=${encodeURIComponent(id)}`, {
      headers: { "x-council-passcode": passcode },
    });
    if (r.ok) setOpen(await r.json());
  }
  async function del(id: string) {
    await fetch(`/api/plans?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-council-passcode": passcode },
    });
    setSummaries((s) => s.filter((x) => x.id !== id));
    if (open?.id === id) setOpen(null);
  }

  // Group by project
  const byProject = summaries.reduce<Record<string, Summary[]>>((acc, s) => {
    (acc[s.project] ??= []).push(s);
    return acc;
  }, {});
  const projects = Object.keys(byProject).sort();

  if (open) {
    const finalText =
      (open.synth?.synthesis ?? "") +
      (open.critique?.revisions ? `\n\n## Red-team revisions\n${open.critique.revisions}` : "");
    return (
      <div className="mt-6">
        <button onClick={() => setOpen(null)} className="text-sm text-muted hover:text-ink">
          ← All plans
        </button>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">{open.title}</h2>
        <p className="mt-1 text-xs text-subtle">
          {open.project} · {new Date(open.createdAt).toLocaleString()}
        </p>
        <p className="mt-3 rounded-lg border border-edge bg-surface p-3 text-sm text-muted">{open.idea}</p>

        {open.synth?.synthesis && (
          <section className="mt-5 rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
            <h3 className="mb-3 text-base font-bold text-ink">Synthesized plan</h3>
            <Markdown text={open.synth.synthesis} />
          </section>
        )}
        {open.critique?.revisions && (
          <section
            className="mt-3 rounded-xl border p-5"
            style={{ borderColor: "color-mix(in srgb, var(--color-warn) 40%, transparent)", background: "color-mix(in srgb, var(--color-warn) 8%, transparent)" }}
          >
            <h3 className="mb-2 text-sm font-bold text-ink">Red-team revisions</h3>
            <Markdown text={open.critique.revisions} />
          </section>
        )}
        {open.members && open.members.length > 0 && (
          <>
            <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-subtle">Proposals</h3>
            <div className="flex flex-col gap-2">
              {open.members.map((m) => (
                <details key={m.provider} className="rounded-lg border border-edge bg-surface">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                    <span className="mr-2 text-subtle" aria-hidden>▸</span>
                    {m.label}
                    {m.lens && <span className="ml-2 rounded bg-raised px-1.5 py-0.5 text-[10px] text-subtle">{m.lens}</span>}
                  </summary>
                  <div className="border-t border-edge px-4 py-3">
                    {m.plan ? <Markdown text={m.plan} /> : <p className="text-sm text-subtle">{m.error}</p>}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}
        <div className="mt-4">
          <button onClick={() => del(open.id)} className="text-xs text-subtle hover:text-[color:var(--color-stop)]">
            Delete this plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* passcode entry if not loaded */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="w-44 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-subtle focus:border-edge-bright"
        />
        <button
          onClick={() => {
            localStorage.setItem(PASSCODE_KEY, passcode);
            load(passcode);
          }}
          className="rounded-lg border border-edge px-3 py-2 text-sm font-medium text-muted hover:text-ink"
        >
          Load
        </button>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--color-stop)" }}>{error}</p>}

      {loaded && !error && summaries.length === 0 && (
        <p className="text-sm text-subtle">
          No saved plans yet. Generate one on{" "}
          <a href="/build" className="text-accent hover:underline">Plan a build</a> and hit Save.
        </p>
      )}

      {projects.map((proj) => (
        <section key={proj} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-subtle">{proj}</h2>
          <div className="flex flex-col gap-2">
            {byProject[proj].map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-lg border border-edge bg-surface px-4 py-3">
                <button onClick={() => openPlan(s.id)} className="min-w-0 flex-1 text-left">
                  <span className="line-clamp-1 text-sm font-medium text-ink">{s.title}</span>
                  <span className="text-xs text-subtle">{new Date(s.createdAt).toLocaleDateString()}</span>
                </button>
                <button onClick={() => del(s.id)} className="text-xs text-subtle hover:text-[color:var(--color-stop)]">
                  delete
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
