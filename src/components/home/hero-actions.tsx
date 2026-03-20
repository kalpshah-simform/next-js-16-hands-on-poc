"use client";

import Link from "next/link";

export default function HeroActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
        href="/login"
      >
        Login
      </Link>
      <Link
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:border-slate-500"
        href="/signup"
      >
        Signup
      </Link>
      <Link
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:border-slate-500"
        href="/dashboard"
      >
        Dashboard
      </Link>
    </div>
  );
}
