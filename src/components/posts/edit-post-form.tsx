"use client";

import { useActionState } from "react";
import { updatePostAction, type PostActionState } from "@/actions/post-actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const INITIAL_POST_ACTION_STATE: PostActionState = {};

type EditPostFormProps = {
  id: string;
  title: string;
  content: string;
};

export function EditPostForm({ id, title, content }: EditPostFormProps) {
  const [state, action] = useActionState(
    updatePostAction,
    INITIAL_POST_ACTION_STATE,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={id} />

      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="title"
      >
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        minLength={3}
        defaultValue={title}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
      />
      {state.fieldErrors?.title ? (
        <p className="text-sm text-red-700">
          {state.fieldErrors.title.join(" ")}
        </p>
      ) : null}

      <label
        className="block text-sm font-medium text-slate-700"
        htmlFor="content"
      >
        Content
      </label>
      <textarea
        id="content"
        name="content"
        rows={8}
        defaultValue={content}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
      />
      {state.fieldErrors?.content ? (
        <p className="text-sm text-red-700">
          {state.fieldErrors.content.join(" ")}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}

      <FormSubmitButton
        idleLabel="Save Changes"
        pendingLabel="Saving changes..."
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
}
