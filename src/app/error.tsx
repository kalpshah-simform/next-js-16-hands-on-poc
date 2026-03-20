"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center p-6">
      <section className="w-full rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-2xl font-semibold text-red-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-700">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Try again
        </button>
      </section>
    </main>
  );
}