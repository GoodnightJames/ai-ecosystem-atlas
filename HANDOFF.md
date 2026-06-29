# Handoff: AI Ecosystem Atlas

## What this is
A standalone, static website visualizing the **June 2026** AI model lineups of OpenAI,
Anthropic, and Google — "informative but entertaining." No DB, no auth, no server.

## Where it lives
- **Repo:** [`GoodnightJames/ai-ecosystem-atlas`](https://github.com/GoodnightJames/ai-ecosystem-atlas) — its own repo now.
- **Default branch:** `main`.
- **History:** extracted from `GoodnightJames/merch-buying-desk` (branch
  `claude/ai-ecosystem-catalog-viz-y1w5qd`, subdir `ai-ecosystem-catalog/`) via
  `git subtree split`. The old draft PR #91 in merch is obsolete and should not be merged.

## Status (as of extraction, 2026-06-29)
- Extracted, pushed, and verified on a **fresh clone**: `npm install` clean,
  `npm run typecheck` clean, **25/25 Vitest tests pass**, `npm run build` emits all
  static routes (overview, /compare, /status, /timeline, /labs/[labId], /models/[modelId]).
- **Not yet deployed anywhere.** Next step is a Vercel project (see README → Deploy).

## Stack
Next.js 16 (App Router, static export: `output: "export"`) · React 19 · TypeScript strict ·
Tailwind v4 · Vitest. Dark "command-center" theme.

## Layout
- `data/*.ts` — **single source of truth.** `types.ts` (schema + `as const` enums),
  `models.ts`, `labs.ts`, `ecosystem.ts`, `timeline.ts`, `index.ts` (deep-frozen + helpers).
  No fact is hardcoded in a component.
- `app/` — `/` (overview), `/compare` (client Explorer), `/status`, `/timeline`,
  `/labs/[labId]`, `/models/[modelId]`. **Gotcha:** Next 16 makes route `params` a Promise —
  dynamic routes must `await params`.
- `components/`, `lib/` — UI + pure filter/sort/format helpers.
- 25 Vitest tests (data integrity + filtering).

## Run / verify (from repo root)
```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # 25 tests
npm run typecheck  # tsc --noEmit
npm run lint
npm run build      # static export → ./out
```

## Likely next steps
1. **Deploy to Vercel** (`npx vercel && npx vercel --prod` — needs your Vercel auth).
2. **Build the update-agent** (the "keep it current" phase, not yet built). Every entry carries
   `provenance { sourceUrl, confidence, lastVerified }`. A future agent should: scan for stale
   `lastVerified` → re-fetch `sourceUrl` → propose edits to `data/*.ts` behind human approval.
   Enums are `as const`; IDs are stable + append-only.
3. Optional: domain + custom name (it's "AI Ecosystem Atlas" for now).
