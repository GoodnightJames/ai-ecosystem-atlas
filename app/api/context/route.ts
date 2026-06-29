import {
  storageConfigured,
  saveContext,
  getContext,
  listContexts,
  deleteContext,
  slugify,
} from "@/lib/store";

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

const NOT_CONFIGURED = { error: "Storage isn't configured (add Upstash Redis)." };

export async function GET(req: Request) {
  const g = gate(req);
  if (g) return g;
  if (!storageConfigured()) return Response.json(NOT_CONFIGURED, { status: 503 });
  const slug = new URL(req.url).searchParams.get("slug");
  try {
    if (slug) {
      const c = await getContext(slug);
      return c ? Response.json(c) : Response.json({ error: "Not found." }, { status: 404 });
    }
    return Response.json({ contexts: await listContexts() });
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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const brief = typeof body.brief === "string" ? body.brief.trim() : "";
  if (!name || !brief) return Response.json({ error: "name and brief are required." }, { status: 400 });
  const slug = slugify(name);
  try {
    await saveContext({ slug, name, brief, updatedAt: Date.now() });
    return Response.json({ slug, name });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = gate(req);
  if (g) return g;
  if (!storageConfigured()) return Response.json(NOT_CONFIGURED, { status: 503 });
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return Response.json({ error: "Missing slug." }, { status: 400 });
  try {
    await deleteContext(slug);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 500 });
  }
}
