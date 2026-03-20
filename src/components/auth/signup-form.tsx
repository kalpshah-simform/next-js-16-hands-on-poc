"use client";

import { useActionState } from "react";
import { signupAction, type AuthActionState } from "@/actions/auth-actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const INITIAL_AUTH_ACTION_STATE: AuthActionState = {};

export function SignupForm() {
  const [state, action] = useActionState(
    signupAction,
    INITIAL_AUTH_ACTION_STATE,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="name"
      >
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        minLength={2}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
      />
      {state.fieldErrors?.name ? (
        <p className="text-sm text-red-700">
          {state.fieldErrors.name.join(" ")}
        </p>
      ) : null}

      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="email"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
      />
      {state.fieldErrors?.email ? (
        <p className="text-sm text-red-700">
          {state.fieldErrors.email.join(" ")}
        </p>
      ) : null}

      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="password"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
      />
      {state.fieldErrors?.password ? (
        <p className="text-sm text-red-700">
          {state.fieldErrors.password.join(" ")}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}

      <FormSubmitButton
        idleLabel="Create account"
        pendingLabel="Creating account..."
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
}
