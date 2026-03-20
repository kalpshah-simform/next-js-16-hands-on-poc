import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center p-6">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">404</h1>
        <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}