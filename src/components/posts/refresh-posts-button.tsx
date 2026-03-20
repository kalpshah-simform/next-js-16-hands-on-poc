"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function RefreshPostsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Refreshing..." : "Refresh"}
    </button>
  );
}
