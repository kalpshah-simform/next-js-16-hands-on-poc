import { Suspense } from "react";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth";
import { NewPostForm } from "@/components/posts/new-post-form";

async function NewPostContent() {
  await connection();
  await requireUser();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create Post</h1>
      <p className="mt-2 text-sm text-slate-600">This form uses a server action with Zod validation.</p>

      <NewPostForm />
    </section>
  );
}

export default function NewPostPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl p-6">
      <Suspense
        fallback={
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Loading form...</p>
          </section>
        }
      >
        <NewPostContent />
      </Suspense>
    </main>
  );
}
