import { configuredMembers, proposePlans, synthesizePlans, critiquePlan } from "@/lib/council";
import type { MemberResult } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Multi-model + synthesis can run long; needs a Vercel plan that allows it.
export const maxDuration = 60;

/** Config probe — lets the UI show what's available without sending an idea. */
export function GET() {
  const members = configuredMembers();
  return Response.json({
    ready: Boolean(process.env.COUNCIL_PASSCODE) && members.length > 0,
    passcodeRequired: Boolean(process.env.COUNCIL_PASSCODE),
    members: members.map(({ provider, label, model, lens }) => ({ provider, label, model, lens })),
  });
}

export async function POST(req: Request) {
  const passcode = process.env.COUNCIL_PASSCODE;
  if (!passcode) {
    return Response.json(
      {
        error:
          "The council isn't enabled on this deployment. Set COUNCIL_PASSCODE and at least ANTHROPIC_API_KEY in the environment.",
      },
      { status: 503 },
    );
  }
  if (req.headers.get("x-council-passcode") !== passcode) {
    return Response.json({ error: "Wrong or missing passcode." }, { status: 401 });
  }

  let body: {
    idea?: unknown;
    phase?: unknown;
    members?: unknown;
    synthesis?: unknown;
    context?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const idea = body.idea;
  if (typeof idea !== "string" || idea.trim().length < 10) {
    return Response.json(
      { error: "Describe your idea in at least a sentence." },
      { status: 400 },
    );
  }
  const context = typeof body.context === "string" ? body.context : undefined;

  try {
    // Two phases (each its own request) keep every invocation under the
    // serverless time limit. Default = propose; "synthesize" merges them.
    if (body.phase === "synthesize") {
      if (!Array.isArray(body.members)) {
        return Response.json({ error: "Missing member plans to synthesize." }, { status: 400 });
      }
      const out = await synthesizePlans(idea.trim(), body.members as MemberResult[], context);
      return Response.json(out);
    }
    if (body.phase === "critique") {
      if (typeof body.synthesis !== "string" || !body.synthesis.trim()) {
        return Response.json({ error: "Missing synthesis to critique." }, { status: 400 });
      }
      const out = await critiquePlan(idea.trim(), body.synthesis, context);
      return Response.json(out);
    }
    const members = await proposePlans(idea.trim(), context);
    return Response.json({ members });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "The council failed." },
      { status: 500 },
    );
  }
}
