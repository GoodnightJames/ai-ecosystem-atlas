import "server-only";
import { Redis } from "@upstash/redis";

/**
 * Plan library persistence (Upstash Redis / Vercel KV). Stores council plans so
 * they're durable, cross-device, and browsable per project — not stuck in one
 * browser's localStorage. Reads the standard Upstash/KV env vars the Vercel
 * Marketplace integration injects; if absent, the library is simply disabled.
 */

export interface StoredPlan {
  id: string;
  project: string;
  title: string;
  idea: string;
  members: unknown;
  synth: unknown;
  critique: unknown;
  createdAt: number;
}
export interface PlanSummary {
  id: string;
  project: string;
  title: string;
  createdAt: number;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function storageConfigured(): boolean {
  return getRedis() !== null;
}

const KEY = (id: string) => `plan:${id}`;
const INDEX = "plans:index"; // sorted set, score = createdAt

export async function savePlan(p: StoredPlan): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Plan storage not configured.");
  await r.set(KEY(p.id), p);
  await r.zadd(INDEX, { score: p.createdAt, member: p.id });
}

export async function listPlans(): Promise<PlanSummary[]> {
  const r = getRedis();
  if (!r) throw new Error("Plan storage not configured.");
  const ids = (await r.zrange(INDEX, 0, -1, { rev: true })) as string[];
  if (!ids.length) return [];
  const full = (await r.mget(...ids.map(KEY))) as (StoredPlan | null)[];
  return full
    .filter((p): p is StoredPlan => p !== null)
    .map(({ id, project, title, createdAt }) => ({ id, project, title, createdAt }));
}

export async function getPlan(id: string): Promise<StoredPlan | null> {
  const r = getRedis();
  if (!r) throw new Error("Plan storage not configured.");
  return ((await r.get(KEY(id))) as StoredPlan | null) ?? null;
}

export async function deletePlan(id: string): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Plan storage not configured.");
  await r.del(KEY(id));
  await r.zrem(INDEX, id);
}

// ── Project context profiles ────────────────────────────────────────────────
// A per-project brief (brand, voice, what already exists, constraints) injected
// into the council so it plans WITH context instead of blind.

export interface ProjectContext {
  slug: string;
  name: string;
  brief: string;
  updatedAt: number;
}

export {slugify} from "./slug";

const CTX = (slug: string) => `context:${slug}`;
const CTX_INDEX = "contexts:index";

export async function saveContext(c: ProjectContext): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured.");
  await r.set(CTX(c.slug), c);
  await r.sadd(CTX_INDEX, c.slug);
}

export async function getContext(slug: string): Promise<ProjectContext | null> {
  const r = getRedis();
  if (!r) return null;
  return ((await r.get(CTX(slug))) as ProjectContext | null) ?? null;
}

export async function listContexts(): Promise<{ slug: string; name: string; updatedAt: number }[]> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured.");
  const slugs = (await r.smembers(CTX_INDEX)) as string[];
  if (!slugs.length) return [];
  const full = (await r.mget(...slugs.map(CTX))) as (ProjectContext | null)[];
  return full
    .filter((c): c is ProjectContext => c !== null)
    .map(({ slug, name, updatedAt }) => ({ slug, name, updatedAt }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function deleteContext(slug: string): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured.");
  await r.del(CTX(slug));
  await r.srem(CTX_INDEX, slug);
}
