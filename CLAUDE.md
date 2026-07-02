# AI Ecosystem Atlas

Next.js 16 site visualizing the OpenAI/Anthropic/Google model lineups (June-2026 snapshot), grown into a working tool: live multi-model council (`/build` → `/api/council`), Upstash plan library (`/plans`), project context profiles (`/context`), model chooser (`/choose`). Live at https://ai-ecosystem-atlas.vercel.app.

**Start every session by reading `HANDOFF.md`** — this repo grows features faster than external notes track it.

## Commands

- `npm run test` — Vitest (data integrity + filtering). Must pass before any commit.
- `npm run typecheck` — `tsc --noEmit`. The de-facto lint gate.
- `npm run build` — Next build (~41 routes). Content pages prerender; `/api/council` and `/api/plans` are dynamic.
- `npm run dev` — local dev. Preview config "atlas" (port 3600) lives in `/Volumes/WorkSSD/.claude/launch.json`.

## Deploy

- Via CLI, **not** git-connected: `npx vercel --prod -b NEXT_PUBLIC_ATLAS_COMMIT=$(git rev-parse --short HEAD)` (the -b flag feeds the footer commit SHA).
- Pushing to GitHub does NOT deploy — safe to push freely.
- Council/plans need Vercel env vars (API keys, COUNCIL_PASSCODE, KV_REST_API_*). Keys never in the browser or the repo.

## Data conventions (the important part)

- `data/*.ts` is the single source of truth; **no fact hardcoded in components**.
- Every entry carries `provenance { sourceUrl, confidence, lastVerified }` — update `lastVerified` whenever you verify a fact, even if unchanged.
- IDs are **stable and append-only**; never rename or delete an ID (pages and cross-refs hang off them).
- Enums are `as const` — invalid values fail `npm run typecheck`, which is intentional.
- New models: append to `data/models.ts`; `generateStaticParams` picks them up automatically.
- Data refresh procedure: `.claude/skills/atlas-data-refresh/SKILL.md`.

## Traps

- Next 16: route `params` is a Promise — `await params` in dynamic routes.
- Do NOT re-add `output: "export"` to next.config — it was deliberately dropped for the council API route.
- `/api/council` phases must each stay under ~50s (Vercel Hobby 60s cap) — don't merge the propose/synthesize/critique phases.
- Benchmarks are "reported" values, not verified — keep the freshness pill honest ("LIVE · <month>", never "verified").
