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
interface CouncilResult {
  members: MemberResult[];
  synthesis: string | null;
  synthesisError?: string;
}
interface Config {
  ready: boolean;
  passcodeRequired: boolean;
  members: { provider: string; label: string; model: string }[];
}

const PASSCODE_KEY = "council-passcode";

export function CouncilForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [idea, setIdea] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CouncilResult | null>(null);

  useEffect(() => {
    setPasscode(localStorage.getItem(PASSCODE_KEY) ?? "");
    fetch("/api/council")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ ready: false, passcodeRequired: false, members: [] }));
  }, []);

  async function convene() {
    setLoading(true);
    setError(null);
    setResult(null);
    localStorage.setItem(PASSCODE_KEY, passcode);
    try {
      const r = await fetch("/api/council", {
        method: "POST",
        headers: { "content-type": "application/json", "x-council-passcode": passcode },
        body: JSON.stringify({ idea }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error ?? `Request failed (${r.status}).`);
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error reaching the council.");
    } finally {
      setLoading(false);
    }
  }

  const memberCount = config?.members.length ?? 0;
  const canSubmit = idea.trim().length >= 10 && passcode.trim() && !loading;

  return (
    <div className="mt-6">
      {/* Config banner */}
      {config && !config.ready && (
        <div className="mb-5 rounded-lg border border-edge bg-surface p-4 text-sm text-muted">
          <p className="font-medium text-ink">The council isn&rsquo;t enabled on this deployment yet.</p>
          <p className="mt-1">
            Set <code className="font-mono text-xs text-ink">COUNCIL_PASSCODE</code> and at least{" "}
            <code className="font-mono text-xs text-ink">ANTHROPIC_API_KEY</code> in the Vercel
            environment. Add <code className="font-mono text-xs text-ink">OPENAI_API_KEY</code> +{" "}
            <code className="font-mono text-xs text-ink">COUNCIL_OPENAI_MODEL</code> and{" "}
            <code className="font-mono text-xs text-ink">GEMINI_API_KEY</code> +{" "}
            <code className="font-mono text-xs text-ink">COUNCIL_GOOGLE_MODEL</code> to add more
            members. You can still type below — calls will return a setup error until then.
          </p>
        </div>
      )}
      {config && config.members.length > 0 && (
        <p className="mb-3 text-xs text-subtle">
          Council ({memberCount}):{" "}
          {config.members.map((m) => `${m.label} · ${m.model}`).join("  ·  ")}
        </p>
      )}

      {/* Form */}
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
          {loading ? `Consulting ${memberCount || ""} models…` : "Convene the council"}
        </button>
        {loading && (
          <span className="text-xs text-subtle">This can take 20–40s while each model thinks.</span>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[color:var(--color-stop)]/40 bg-[color:var(--color-stop)]/10 px-3 py-2 text-sm" style={{ color: "var(--color-stop)" }}>
          {error}
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8">
          {result.synthesis ? (
            <section className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                <span className="text-accent" aria-hidden>✦</span> Synthesized plan
              </h2>
              <Markdown text={result.synthesis} />
            </section>
          ) : (
            <p className="text-sm text-subtle">{result.synthesisError}</p>
          )}

          <h3 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">
            What each model proposed
          </h3>
          <div className="flex flex-col gap-2">
            {result.members.map((m) => (
              <details key={m.provider} className="rounded-lg border border-edge bg-surface">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
                  <span className="mr-2 text-subtle" aria-hidden>▸</span>
                  {m.label} <span className="font-mono text-xs text-subtle">{m.model}</span>
                  {m.error && <span className="ml-2 text-xs" style={{ color: "var(--color-stop)" }}>failed</span>}
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
