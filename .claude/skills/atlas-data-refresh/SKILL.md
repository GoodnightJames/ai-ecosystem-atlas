---
name: atlas-data-refresh
description: Refresh the Atlas model catalogue — scan data/*.ts for entries whose provenance.lastVerified is stale, re-check each against its provenance.sourceUrl, update changed facts, bump lastVerified, and open a PR for human review. Use when asked to refresh/update the atlas data, check for stale models, or run the update agent.
---

# Atlas data refresh

The Atlas promises a dated snapshot, not live truth — the job is to move the snapshot forward **behind human approval**. Never merge; always end at a PR.

## Procedure

1. **Scan for stale entries.** Read `data/models.ts`, `data/ecosystem.ts`, `data/timeline.ts`. An entry is stale when `provenance.lastVerified` is older than 30 days (or the threshold the user gives). List the stale IDs before touching anything.

2. **Re-check each stale entry against its `provenance.sourceUrl`** (WebFetch). Compare the fetched page against the entry's facts: status (GA/preview/restricted/retired), pricing, context window, max output, release/retired dates, headline capabilities.
   - **Fact changed** → update the field(s) AND set `lastVerified` to today. If the change is a status/lifecycle event (launch, retirement, restriction), also append a `timeline.ts` event.
   - **Fact unchanged** → bump `lastVerified` only.
   - **Source unreachable or ambiguous** → leave the entry untouched, lower `confidence` if clearly warranted, and list it in the PR body under "needs human eyes".

3. **New models spotted while checking sources** (e.g. a lab page lists a successor): append a new entry to `data/models.ts` with a fresh stable ID (IDs are append-only — never rename or delete existing ones), full `provenance`, and `confidence: "reported"` unless the source is the lab's own docs. Wire `supersedes` if applicable.

4. **Respect the schema.** Enums are `as const` — if a new status/tier/modality doesn't fit, do NOT widen the enum silently; flag it in the PR body instead.

5. **Verify:** `npm run test` and `npm run typecheck` must both exit 0. The integrity tests catch broken cross-references and duplicate IDs — fix, don't skip.

6. **Deliver as a PR.** Branch `data-refresh-<YYYY-MM-DD>`, commit, push, open a PR titled "Data refresh <date>" whose body lists: entries updated (with what changed), entries bumped-only, entries needing human eyes, new models added. **Do not merge.** Deploy happens manually after James merges (`npx vercel --prod ...` — see CLAUDE.md).

## Notes

- Anthropic model facts: prefer docs.anthropic.com over news posts.
- Pricing is per-MTok input/output; don't convert units.
- Keep the freshness pill month (`LIVE · <MON> <YYYY>`) in sync if the snapshot month advances — it lives in the TopBar component.
