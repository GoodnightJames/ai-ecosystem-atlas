# AI Ecosystem Atlas

An informative, interactive, **static** visualization of the OpenAI, Anthropic, and Google AI model
lineups as of **late June 2026** — including the dramatic fortnight when two of the three major US
labs had frontier models placed under government access restrictions.

> **Standalone project.** Extracted (with history) from the `merch-buying-desk` repo into its own
> repository at [`GoodnightJames/ai-ecosystem-atlas`](https://github.com/GoodnightJames/ai-ecosystem-atlas).
> It shares no code with anything else — its own `package.json`, its own everything.

## What's here

- **Overview** (`/`) — the headline "Great June 2026 Lockdown" story + availability at a glance.
- **Cross-Lab Compare** (`/compare`) — filter by lab / status / tier / modality, search, sort by
  price or release, and tick up to four models to line up side by side.
- **Status Board** (`/status`) — every model grouped by availability with traffic-light styling.
- **Timeline** (`/timeline`) — 2026 launches, updates, and the mid-June restriction arc.
- **Per-lab pages** (`/labs/[labId]`) — themed catalogue + naming story + fun facts per lab.
- **Model detail** (`/models/[modelId]`) — specs, highlights, relationships, and provenance.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Vitest. Every
content route is statically prerendered; the one exception is **`/api/council`**, a dynamic
serverless route powering the live "Plan a build" model council (see below). No database, no auth.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # data-integrity + filtering unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build → ./.next
```

## Plan a build — the live model council (`/build`)

Describe a project and a council of **real** current models each proposes how to build it, then
Claude synthesizes one recommended plan. It calls live APIs, so it needs keys (server-side only —
never the browser) and a passcode gate. Without them the rest of the site works fine and `/build`
shows a setup notice. Configure in Vercel env (and `.env.local` for dev) — see [`.env.example`](./.env.example):

- `COUNCIL_PASSCODE` — required gate so the endpoint can't burn your API budget.
- `ANTHROPIC_API_KEY` — required; the default member and the synthesizer (`claude-opus-4-8`).
- `OPENAI_API_KEY` + `COUNCIL_OPENAI_MODEL`, `GEMINI_API_KEY` + `COUNCIL_GOOGLE_MODEL` — optional
  extra members. Use **real, callable** model ids — the catalogue's speculative ids won't resolve.

## Data model (single source of truth)

All facts live in typed modules under [`data/`](./data):

- `types.ts` — the schema + enums (the regeneration contract).
- `models.ts`, `labs.ts`, `ecosystem.ts`, `timeline.ts` — the content.
- `index.ts` — deep-frozen exports + query helpers (`allModels`, `modelsByLab`, …).

**No fact is hardcoded in a component.** Every entry carries a `provenance` block (`sourceUrl`,
`confidence`, `lastVerified`), so a future update-agent can scan for stale rows, re-fetch the source,
and propose edits. The `as const` enums make the strict compiler reject invalid appended values, and
IDs are stable + append-only so cross-references stay valid.

## Agents (later)

This v1 is the static visualization. The data layer is deliberately agent-ready: a follow-up can add
an update-agent that diffs each entry against its `sourceUrl`, then proposes changes through a
human-approval step before they land in `data/`.

## Deploy (Vercel)

Vercel auto-detects Next.js — content pages serve as static assets and `/api/council` runs as a
serverless function. From the repo root:

```bash
npx vercel          # link & deploy a preview
npx vercel --prod   # promote to production
```

The site deploys and works without any env vars (the council just stays disabled). To enable the
council, add the env vars from [`.env.example`](./.env.example) in the Vercel project settings.

> The footer commit SHA is inlined at build. CLI deploys don't auto-set it, so pass it through:
> `npx vercel --prod -b NEXT_PUBLIC_ATLAS_COMMIT=$(git rev-parse --short HEAD)`.

---

*Dated snapshot — late June 2026. Model names and availability shift quickly; treat as a
point-in-time reference, not a permanent record.*
