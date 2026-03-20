import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { deletePostAction } from "@/actions/post-actions";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { RefreshPostsButton } from "@/components/posts/refresh-posts-button";

async function getPostsForUser(userId: string) {
  return db.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
}

async function PostsContent() {
  await connection();
  const user = await requireUser();
  const posts = await getPostsForUser(user.id);

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Posts</h1>
          <p className="text-sm text-slate-300">Manage your posts with server actions and Prisma.</p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshPostsButton />
          <Link
            href="/posts/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            New Post
          </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <section className="mt-6 rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-300">
          You have not created posts yet. Start by creating your first post.
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {post.content?.trim() ? post.content : "No content added."}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Updated {post.updatedAt.toLocaleString()}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Edit
                </Link>

                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default function PostsPage() {

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-6 text-slate-100">
      <Suspense fallback={<p className="text-sm text-slate-300">Loading posts...</p>}>
        <PostsContent />
      </Suspense>
    </main>
  );
}
