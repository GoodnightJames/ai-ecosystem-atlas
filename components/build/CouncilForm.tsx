"use client";

import { useEffect, useState } from "react";
import { Markdown } from "@/components/kit/Markdown";

interface MemberResult {
  provider: string;
  label: string;
  model: string;
  lens?: string;
  plan: string | null;
  error?: string;
}
interface Synth {
  synthesis: string | null;
  synthesisError?: string;
}
interface Critique {
  critic: string;
  critique: string;
  finalPlan: string | null;
  error?: string;
}
interface Config {
  ready: boolean;
  members: { provider: string; label: string; model: string; lens?: string }[];
}
interface SavedPlan {
  id: string;
  idea: string;
  members: MemberResult[];
  synth: Synth | null;
  critique: Critique | null;
  savedAt: string;
}
type Phase = "idle" | "proposing" | "synthesizing" | "hardening";

const PASSCODE_KEY = "council-passcode";
const SAVED_KEY = "council-saved";

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      className="rounded-md border border-edge px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

export function CouncilForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [idea, setIdea] = useState("");
  const [passcode, setPasscode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberResult[] | null>(null);
  const [synth, setSynth] = useState<Synth | null>(null);
  const [critique, setCritique] = useState<Critique | null>(null);
  const [refine, setRefine] = useState("");
  const [saved, setSaved] = useState<SavedPlan[]>([]);

  useEffect(() => {
    setPasscode(localStorage.getItem(PASSCODE_KEY) ?? "");
    try {
      setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]"));
    } catch {}
    fetch("/api/council")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ ready: false, members: [] }));
  }, []);

  const post = (body: object) =>
    fetch("/api/council", {
      method: "POST",
      headers: { "content-type": "application/json", "x-council-passcode": passcode },
      body: JSON.stringify(body),
    });

  async function run(theIdea: string) {
    setError(null);
    setMembers(null);
    setSynth(null);
    setCritique(null);
    localStorage.setItem(PASSCODE_KEY, passcode);
    setPhase("proposing");
    try {
      const r1 = await post({ idea: theIdea });
      const d1 = await r1.json();
      if (!r1.ok) {
        setError(d1.error ?? `Request failed (${r1.status}).`);
        setPhase("idle");
        return;
      }
      setMembers(d1.members);

      setPhase("synthesizing");
      const r2 = await post({ idea: theIdea, phase: "synthesize", members: d1.members });
      const d2: Synth = await r2.json();
      setSynth(r2.ok ? d2 : { synthesis: null, synthesisError: (d2 as { error?: string }).error });

      if (r2.ok && d2.synthesis) {
        setPhase("hardening");
        const r3 = await post({ idea: theIdea, phase: "critique", synthesis: d2.synthesis });
        const d3: Critique = await r3.json();
        if (r3.ok) setCritique(d3);
      }
    } catch {
      setError("Network error reaching the council.");
    } finally {
      setPhase("idle");
    }
  }

  function doRefine() {
    const base = critique?.finalPlan ?? synth?.synthesis;
    if (!base || !refine.trim()) return;
    const augmented = `${idea}\n\n[Refinement request: ${refine.trim()}]\n\nThe council previously produced this plan — revise it to satisfy the refinement, keeping what still holds:\n\n${base}`;
    setRefine("");
    run(augmented);
  }

  function persistSaved(next: SavedPlan[]) {
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next.slice(0, 25)));
  }
  function saveCurrent() {
    if (!members) return;
    const entry: SavedPlan = {
      id: `${Date.now()}`,
      idea,
      members,
      synth,
      critique,
      savedAt: new Date().toLocaleString(),
    };
    persistSaved([entry, ...saved]);
  }
  function loadSaved(s: SavedPlan) {
    setIdea(s.idea);
    setMembers(s.members);
    setSynth(s.synth);
    setCritique(s.critique);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const busy = phase !== "idle";
  const memberCount = config?.members.length ?? 0;
  const canSubmit = idea.trim().length >= 10 && passcode.trim().length > 0 && !busy;
  const finalPlan = critique?.finalPlan ?? synth?.synthesis ?? "";
  const claudeCodePrompt = finalPlan
    ? `Implement the following plan in this repository. Work phase by phase; after each phase run the build/tests and report. Ask before any destructive or irreversible action. Keep changes minimal and match existing conventions.\n\n${finalPlan}`
    : "";

  function downloadMd() {
    const blob = new Blob([finalPlan], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "build-plan.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6">
      {config && !config.ready && (
        <div className="mb-5 rounded-lg border border-edge bg-surface p-4 text-sm text-muted">
          <p className="font-medium text-ink">The council isn&rsquo;t enabled on this deployment yet.</p>
          <p className="mt-1">
            Set <code className="font-mono text-xs text-ink">COUNCIL_PASSCODE</code> and at least{" "}
            <code className="font-mono text-xs text-ink">ANTHROPIC_API_KEY</code> in the environment.
          </p>
        </div>
      )}
      {config && config.members.length > 0 && (
        <p className="mb-3 text-xs text-subtle">
          Council ({memberCount}):{" "}
          {config.members
            .map((m) => `${m.label}${m.lens ? ` · ${m.lens}` : ""} · ${m.model}`)
            .join("   ·   ")}
        </p>
      )}

      <label className="mb-1.5 block text-sm font-medium text-ink">Describe your project or idea</label>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={5}
        placeholder="e.g. A booking site for a small Hua Hin café — table reservations over LINE, owner gets SMS + email alerts, runs cheaply…"
        className="w-full resize-y rounded-lg border border-edge bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-subtle focus:border-edge-bright"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="w-40 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-subtle focus:border-edge-bright"
        />
        <button
          type="button"
          onClick={() => run(idea)}
          disabled={!canSubmit}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {phase === "proposing"
            ? `Consulting ${memberCount || ""} models…`
            : phase === "synthesizing"
              ? "Synthesizing…"
              : phase === "hardening"
                ? "Red-teaming…"
                : "Convene the council"}
        </button>
        {busy && <span className="text-xs text-subtle">3 phases, ~20–40s each.</span>}
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "color-mix(in srgb, var(--color-stop) 40%, transparent)", background: "color-mix(in srgb, var(--color-stop) 10%, transparent)", color: "var(--color-stop)" }}
        >
          {error}
        </p>
      )}

      {/* Saved plans */}
      {saved.length > 0 && (
        <details className="mt-5 rounded-lg border border-edge bg-surface">
          <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-medium text-ink">
            <span className="mr-2 text-subtle" aria-hidden>▸</span>Saved plans ({saved.length})
          </summary>
          <ul className="border-t border-edge">
            {saved.map((s) => (
              <li key={s.id} className="flex items-center gap-2 border-b border-edge px-4 py-2 last:border-b-0">
                <button onClick={() => loadSaved(s)} className="min-w-0 flex-1 text-left text-sm text-muted hover:text-ink">
                  <span className="line-clamp-1">{s.idea}</span>
                  <span className="text-xs text-subtle">{s.savedAt}</span>
                </button>
                <button
                  onClick={() => persistSaved(saved.filter((x) => x.id !== s.id))}
                  className="text-xs text-subtle hover:text-[color:var(--color-stop)]"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Results */}
      {members && (
        <div className="mt-8">
          {/* Final (red-teamed) plan */}
          {phase === "synthesizing" || phase === "hardening" ? (
            <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5 text-sm text-muted">
              <span className="text-accent" aria-hidden>✦</span>{" "}
              {phase === "synthesizing"
                ? `Synthesizing from ${members.filter((m) => m.plan).length} proposal(s)…`
                : "Red-teaming & revising the plan…"}
            </div>
          ) : finalPlan ? (
            <section className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                  <span className="text-accent" aria-hidden>✦</span>
                  {critique?.finalPlan ? "Final plan (red-teamed)" : "Synthesized plan"}
                </h2>
                <div className="flex gap-1.5">
                  <CopyBtn text={finalPlan} label="Copy" />
                  <CopyBtn text={claudeCodePrompt} label="Copy for Claude Code" />
                  <button
                    type="button"
                    onClick={downloadMd}
                    className="rounded-md border border-edge px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
                  >
                    .md
                  </button>
                  <button
                    type="button"
                    onClick={saveCurrent}
                    className="rounded-md border border-edge px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
                  >
                    Save
                  </button>
                </div>
              </div>
              {critique?.finalPlan && critique.critic && (
                <p className="mb-3 text-xs text-subtle">Red-teamed by {critique.critic}</p>
              )}
              <Markdown text={finalPlan} />
            </section>
          ) : (
            <p className="text-sm text-subtle">{synth?.synthesisError}</p>
          )}

          {/* Refine */}
          {finalPlan && phase === "idle" && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={refine}
                onChange={(e) => setRefine(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doRefine()}
                placeholder="Refine — e.g. 'make it cheaper', 'what if 10k users'"
                className="min-w-0 flex-1 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-subtle focus:border-edge-bright"
              />
              <button
                type="button"
                onClick={doRefine}
                disabled={!refine.trim()}
                className="rounded-lg border border-edge px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-40"
              >
                Refine ↻
              </button>
            </div>
          )}

          {/* Red-team notes + original synthesis, collapsed */}
          {critique?.critique && (
            <details className="mt-6 rounded-lg border border-edge bg-surface">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                <span className="mr-2 text-subtle" aria-hidden>▸</span>Red-team notes
              </summary>
              <div className="border-t border-edge px-4 py-3">
                <Markdown text={critique.critique} />
              </div>
            </details>
          )}
          {critique?.finalPlan && synth?.synthesis && (
            <details className="mt-2 rounded-lg border border-edge bg-surface">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                <span className="mr-2 text-subtle" aria-hidden>▸</span>Pre-critique synthesis
              </summary>
              <div className="border-t border-edge px-4 py-3">
                <Markdown text={synth.synthesis} />
              </div>
            </details>
          )}

          {/* Member proposals */}
          <h3 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">
            What each model proposed
          </h3>
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <details key={m.provider} className="rounded-lg border border-edge bg-surface">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                  <span className="mr-2 text-subtle" aria-hidden>▸</span>
                  {m.label}
                  {m.lens && <span className="ml-2 rounded bg-raised px-1.5 py-0.5 text-[10px] text-subtle">{m.lens}</span>}{" "}
                  <span className="font-mono text-xs text-subtle">{m.model}</span>
                  {m.error && <span className="ml-2 text-xs" style={{ color: "var(--color-stop)" }}>failed</span>}
                </summary>
                <div className="border-t border-edge px-4 py-3">
                  {m.plan ? <Markdown text={m.plan} /> : <p className="text-sm" style={{ color: "var(--color-stop)" }}>{m.error}</p>}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
