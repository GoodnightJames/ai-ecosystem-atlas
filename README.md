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

Next.js 16 (App Router, **static export**) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Vitest. No database, no auth, no server — every route prerenders to HTML in `out/`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # data-integrity + filtering unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # static export → ./out
```

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

The app is a Next.js static export (`output: "export"`), so it deploys as a static site — no server,
no env vars, no secrets. From the repo root:

```bash
npx vercel          # link & deploy a preview
npx vercel --prod   # promote to production
```

Vercel auto-detects Next.js and runs `npm run build`, serving the generated `out/`. Because this is
its own repo now, there's no monorepo/root-directory clash to configure — accept the defaults.

Any static host works too: run `npm run build` and serve the `out/` directory.

---

*Dated snapshot — late June 2026. Model names and availability shift quickly; treat as a
point-in-time reference, not a permanent record.*
