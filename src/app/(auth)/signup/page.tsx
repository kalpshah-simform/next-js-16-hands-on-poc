import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Signup</h1>
        <p className="mt-2 text-sm text-slate-600">Create your account to start managing posts.</p>

        <SignupForm />
      </section>
    </main>
  );
}