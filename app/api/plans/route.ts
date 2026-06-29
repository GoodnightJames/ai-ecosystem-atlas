import { storageConfigured, savePlan, listPlans, getPlan, deletePlan } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function gate(req: Request): Response | null {
  const pass = process.env.COUNCIL_PASSCODE;
  if (!pass) return Response.json({ error: "Not enabled (set COUNCIL_PASSCODE)." }, { status: 503 });
  if (req.headers.get("x-council-passcode") !== pass) {
    return Response.json({ error: "Wrong or missing passcode." }, { status: 401 });
  }
  return null;
}

const NOT_CONFIGURED = {
  error: "Plan storage isn't configured. Add an Upstash Redis (KV) integration to this project in Vercel, then redeploy.",
};

export async function GET(req: Request) {
  const g = gate(req);
  if (g) return g;
  if (!storageConfigured()) return Response.json(NOT_CONFIGURED, { status: 503 });
  const id = new URL(req.url).searchParams.get("id");
  try {
    if (id) {
      const p = await getPlan(id);
      return p ? Response.json(p) : Response.json({ error: "Not found." }, { status: 404 });
    }
    return Response.json({ plans: await listPlans() });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const g = gate(req);
  if (g) return g;
  if (!storageConfigured()) return Response.json(NOT_CONFIGURED, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid body." }, { status: 400 });
  }
  const idea = body.idea;
  if (typeof idea !== "string" || !idea.trim()) {
    return Response.json({ error: "Missing idea." }, { status: 400 });
  }
  const project = typeof body.project === "string" && body.project.trim() ? body.project.trim() : "Unsorted";
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : idea.trim().slice(0, 80);
  const plan = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    project,
    title,
    idea,
    members: body.members ?? null,
    synth: body.synth ?? null,
    critique: body.critique ?? null,
    createdAt: Date.now(),
  };
  try {
    await savePlan(plan);
    return Response.json({ id: plan.id, project: plan.project, title: plan.title });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = gate(req);
  if (g) return g;
  if (!storageConfigured()) return Response.json(NOT_CONFIGURED, { status: 503 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });
  try {
    await deletePlan(id);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 500 });
  }
}
