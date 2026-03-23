import Image from "next/image";
import dynamic from "next/dynamic";

const HeroActions = dynamic(() => import("@/components/home/hero-actions"));

function getHomeSnapshotNote() {
  return "Foundation setup is complete. Continue with auth and post workflows.";
}

export default function Home() {
  const snapshotNote = getHomeSnapshotNote();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
        <Image
          src="/next.svg"
          alt="Next.js"
          width={120}
          height={24}
          priority
          className="h-6 w-auto"
        />
        <h1 className="text-3xl font-semibold tracking-tight">
          Next16 Fullstack POC
        </h1>
        <p className="mt-3 text-slate-300">
          {snapshotNote}
        </p>
        <p className="mt-1 text-xs text-slate-400">Rendered at request time for predictable auth behavior.</p>
        <HeroActions />
      </section>
    </main>
  );
}
