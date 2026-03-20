import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { logoutAction } from "@/actions/auth-actions";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

async function DashboardContent() {
  await connection();
  const user = await requireUser();
  const postsCount = await db.post.count({
    where: { authorId: user.id },
  });

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-300">
            Signed in as {user.email ?? user.name ?? "unknown"}. Total posts: {postsCount}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Logout
          </button>
        </form>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link className="rounded-lg border border-slate-200 bg-white p-4 hover:border-sky-400" href="/posts">
          <h2 className="text-lg font-semibold text-slate-900">Posts</h2>
          <p className="mt-1 text-sm text-slate-600">View, edit, and delete your posts.</p>
        </Link>
        <Link className="rounded-lg border border-slate-200 bg-white p-4 hover:border-sky-400" href="/posts/new">
          <h2 className="text-lg font-semibold text-slate-900">Create Post</h2>
          <p className="mt-1 text-sm text-slate-600">Create a new post using a server action.</p>
        </Link>
      </section>
    </>
  );
}

export default function DashboardPage() {

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-6 text-slate-100">
      <Suspense fallback={<p className="text-sm text-slate-300">Loading dashboard...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
