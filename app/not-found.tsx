import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Off the star chart</h1>
      <p className="mt-2 text-muted">
        That model or page isn&apos;t in this snapshot of the atlas.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to the Atlas
      </Link>
    </div>
  );
}
