"use client";

import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/actions/auth-actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const INITIAL_AUTH_ACTION_STATE: AuthActionState = {};

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, action] = useActionState(
    loginAction,
    INITIAL_AUTH_ACTION_STATE,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

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
        idleLabel="Login"
        pendingLabel="Signing in..."
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
}
