"use client";

import { useEffect, useState } from "react";
import { Markdown } from "@/components/kit/Markdown";

interface MemberResult {
  provider: string;
  label: string;
  model: string;
  plan: string | null;
  error?: string;
}
interface Config {
  ready: boolean;
  passcodeRequired: boolean;
  members: { provider: string; label: string; model: string }[];
}
type Phase = "idle" | "proposing" | "synthesizing";

const PASSCODE_KEY = "council-passcode";

export function CouncilForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [idea, setIdea] = useState("");
  const [passcode, setPasscode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberResult[] | null>(null);
  const [synth, setSynth] = useState<{ synthesis: string | null; synthesisError?: string } | null>(null);

  useEffect(() => {
    setPasscode(localStorage.getItem(PASSCODE_KEY) ?? "");
    fetch("/api/council")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ ready: false, passcodeRequired: false, members: [] }));
  }, []);

  const post = (extra: object) =>
    fetch("/api/council", {
      method: "POST",
      headers: { "content-type": "application/json", "x-council-passcode": passcode },
      body: JSON.stringify({ idea, ...extra }),
    });

  async function convene() {
    setError(null);
    setMembers(null);
    setSynth(null);
    localStorage.setItem(PASSCODE_KEY, passcode);
    setPhase("proposing");
    try {
      // Phase 1 — each model proposes.
      const r1 = await post({});
      const d1 = await r1.json();
      if (!r1.ok) {
        setError(d1.error ?? `Request failed (${r1.status}).`);
        setPhase("idle");
        return;
      }
      setMembers(d1.members);
      // Phase 2 — Claude synthesizes.
      setPhase("synthesizing");
      const r2 = await post({ phase: "synthesize", members: d1.members });
      const d2 = await r2.json();
      setSynth(
        r2.ok ? d2 : { synthesis: null, synthesisError: d2.error ?? `Synthesis failed (${r2.status}).` },
      );
    } catch {
      setError("Network error reaching the council.");
    } finally {
      setPhase("idle");
    }
  }

  const memberCount = config?.members.length ?? 0;
  const busy = phase !== "idle";
  const canSubmit = idea.trim().length >= 10 && passcode.trim().length > 0 && !busy;

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
          {config.members.map((m) => `${m.label} · ${m.model}`).join("  ·  ")}
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
          onClick={convene}
          disabled={!canSubmit}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {phase === "proposing"
            ? `Consulting ${memberCount || ""} models…`
            : phase === "synthesizing"
              ? "Synthesizing…"
              : "Convene the council"}
        </button>
        {busy && <span className="text-xs text-subtle">Each phase can take 20–40s.</span>}
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "color-mix(in srgb, var(--color-stop) 40%, transparent)", background: "color-mix(in srgb, var(--color-stop) 10%, transparent)", color: "var(--color-stop)" }}
        >
          {error}
        </p>
      )}

      {/* Synthesis (top) */}
      {members && (
        <div className="mt-8">
          {phase === "synthesizing" ? (
            <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5 text-sm text-muted">
              <span className="text-accent" aria-hidden>✦</span> Synthesizing the strongest plan from{" "}
              {members.filter((m) => m.plan).length} proposal(s)…
            </div>
          ) : synth?.synthesis ? (
            <section className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                <span className="text-accent" aria-hidden>✦</span> Synthesized plan
              </h2>
              <Markdown text={synth.synthesis} />
            </section>
          ) : synth?.synthesisError ? (
            <p className="text-sm text-subtle">{synth.synthesisError}</p>
          ) : null}

          {/* Member proposals */}
          <h3 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">
            What each model proposed
          </h3>
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <details key={m.provider} className="rounded-lg border border-edge bg-surface">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                  <span className="mr-2 text-subtle" aria-hidden>▸</span>
                  {m.label} <span className="font-mono text-xs text-subtle">{m.model}</span>
                  {m.error && (
                    <span className="ml-2 text-xs" style={{ color: "var(--color-stop)" }}>failed</span>
                  )}
                </summary>
                <div className="border-t border-edge px-4 py-3">
                  {m.plan ? (
                    <Markdown text={m.plan} />
                  ) : (
                    <p className="text-sm" style={{ color: "var(--color-stop)" }}>{m.error}</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
