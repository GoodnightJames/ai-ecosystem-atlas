import { configuredMembers, runCouncil } from "@/lib/council";

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
    members: members.map(({ provider, label, model }) => ({ provider, label, model })),
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

  let idea: unknown;
  try {
    ({ idea } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof idea !== "string" || idea.trim().length < 10) {
    return Response.json(
      { error: "Describe your idea in at least a sentence." },
      { status: 400 },
    );
  }

  try {
    const result = await runCouncil(idea.trim());
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "The council failed." },
      { status: 500 },
    );
  }
}
