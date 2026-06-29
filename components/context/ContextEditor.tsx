"use client";

import { useCallback, useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

interface CtxSummary {
  slug: string;
  name: string;
  updatedAt: number;
}

const PASSCODE_KEY = "council-passcode";

export function ContextEditor() {
  const [passcode, setPasscode] = useState("");
  const [list, setList] = useState<CtxSummary[]>([]);
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (pc: string) => {
    if (!pc) return;
    try {
      const r = await fetch("/api/context", { headers: { "x-council-passcode": pc } });
      const d = await r.json();
      if (r.ok) setList(d.contexts ?? []);
      else setError(d.error ?? `Failed (${r.status}).`);
    } catch {
      setError("Network error.");
    }
  }, []);

  useEffect(() => {
    const pc = localStorage.getItem(PASSCODE_KEY) ?? "";
    setPasscode(pc);
    refresh(pc);
  }, [refresh]);

  async function load(slug: string) {
    const r = await fetch(`/api/context?slug=${encodeURIComponent(slug)}`, {
      headers: { "x-council-passcode": passcode },
    });
    if (r.ok) {
      const d = await r.json();
      setName(d.name);
      setBrief(d.brief);
      setMsg(null);
    }
  }

  async function save() {
    if (!name.trim() || !brief.trim()) {
      setMsg("Name and brief are both required.");
      return;
    }
    localStorage.setItem(PASSCODE_KEY, passcode);
    setMsg("Saving…");
    try {
      const r = await fetch("/api/context", {
        method: "POST",
        headers: { "content-type": "application/json", "x-council-passcode": passcode },
        body: JSON.stringify({ name, brief }),
      });
      const d = await r.json();
      setMsg(r.ok ? "Saved ✓" : d.error ?? "Save failed.");
      if (r.ok) refresh(passcode);
    } catch {
      setMsg("Save failed.");
    }
  }

  async function del(slug: string) {
    await fetch(`/api/context?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-council-passcode": passcode },
    });
    refresh(passcode);
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* List */}
      <div>
        <div className="mb-3 flex gap-2">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-32 rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-edge-bright"
          />
          <button onClick={() => refresh(passcode)} className="rounded-lg border border-edge px-3 py-2 text-sm text-muted hover:text-ink">
            Load
          </button>
        </div>
        <button
          onClick={() => {
            setName("");
            setBrief("");
            setMsg(null);
          }}
          className="mb-2 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New project context
        </button>
        <ul className="flex flex-col gap-1">
          {list.map((c) => (
            <li key={c.slug} className="flex items-center gap-2 rounded-lg border border-edge bg-surface px-3 py-2">
              <button onClick={() => load(c.slug)} className="min-w-0 flex-1 text-left text-sm text-muted hover:text-ink">
                {c.name}
              </button>
              <button onClick={() => del(c.slug)} className="text-xs text-subtle hover:text-[color:var(--color-stop)]">
                ✕
              </button>
            </li>
          ))}
        </ul>
        {error && <p className="mt-2 text-xs" style={{ color: "var(--color-stop)" }}>{error}</p>}
      </div>

      {/* Editor */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hua Hin Harlequins"
          className="w-full rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-edge-bright"
        />
        {name.trim() && <p className="mt-1 text-xs text-subtle">Slug: {slugify(name) || "—"} (match this to the Project field on /build)</p>}

        <label className="mb-1.5 mt-4 block text-sm font-medium text-ink">Brief</label>
        <p className="mb-1.5 text-xs text-subtle">
          What the council should know: brand &amp; voice, the stack, what already exists (schemas,
          pages, integrations), constraints, and goals. This is injected into every plan for this project.
        </p>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={18}
          placeholder="Brand: …\nStack: …\nWhat exists: …\nConstraints: …\nGoals: …"
          className="w-full resize-y rounded-lg border border-edge bg-surface px-3 py-2.5 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-edge-bright"
        />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={save} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Save context
          </button>
          {msg && <span className="text-xs text-subtle">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
