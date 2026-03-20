import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use your credentials to access protected routes.
      </p>

      <LoginForm nextPath={nextPath} />
    </section>
  );
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <Suspense
        fallback={
          <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Loading login...</p>
          </section>
        }
      >
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
