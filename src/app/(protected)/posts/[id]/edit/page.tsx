import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditPostForm } from "@/components/posts/edit-post-form";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

async function EditPostContent({ params }: EditPostPageProps) {
  await connection();
  const user = await requireUser();
  const { id } = await params;

  const post = await db.post.findFirst({
    where: {
      id,
      authorId: user.id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Post</h1>
        <Link
          href="/posts"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Posts
        </Link>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Update title or content and save changes.
      </p>

      <EditPostForm
        id={post.id}
        title={post.title}
        content={post.content ?? ""}
      />
    </section>
  );
}

export default function EditPostPage({ params }: EditPostPageProps) {

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl p-6">
      <Suspense
        fallback={
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Loading post...</p>
          </section>
        }
      >
        <EditPostContent params={params} />
      </Suspense>
    </main>
  );
}
