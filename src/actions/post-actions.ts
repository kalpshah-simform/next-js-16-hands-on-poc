"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createPostSchema, updatePostSchema } from "@/lib/validations";

export type PostActionState = {
  message?: string;
  fieldErrors?: {
    title?: string[];
    content?: string[];
  };
};

const deletePostSchema = z.object({
  id: z.string().min(1),
});

export async function createPostAction(
  _previousState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await requireUser();

  const parsed = createPostSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
  });

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content?.trim()
          ? parsed.data.content.trim()
          : null,
        authorId: user.id,
      },
    });
  } catch (error) {
    logger.error("Post create failed", {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      message: "Unable to create post right now. Please try again.",
    };
  }

  logger.info("Post created", { userId: user.id });

  revalidatePath("/posts");
  redirect("/posts");
}

export async function updatePostAction(
  _previousState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await requireUser();

  const parsed = updatePostSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
  });

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let updated;

  try {
    updated = await db.post.updateMany({
      where: {
        id: parsed.data.id,
        authorId: user.id,
      },
      data: {
        title: parsed.data.title,
        content: parsed.data.content?.trim()
          ? parsed.data.content.trim()
          : null,
      },
    });
  } catch (error) {
    logger.error("Post update failed", {
      userId: user.id,
      postId: parsed.data.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      message: "Unable to update post right now. Please try again.",
    };
  }

  if (updated.count === 0) {
    return {
      message: "Post not found or access denied.",
    };
  }

  logger.info("Post updated", { userId: user.id, postId: parsed.data.id });

  revalidatePath("/posts");
  redirect("/posts");
}

export async function deletePostAction(formData: FormData) {
  const user = await requireUser();

  const parsed = deletePostSchema.safeParse({
    id: String(formData.get("id") ?? ""),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Delete payload is invalid.",
    );
  }

  let deleted;

  try {
    deleted = await db.post.deleteMany({
      where: {
        id: parsed.data.id,
        authorId: user.id,
      },
    });
  } catch (error) {
    logger.error("Post delete failed", {
      userId: user.id,
      postId: parsed.data.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Unable to delete post right now.");
  }

  if (deleted.count === 0) {
    throw new Error("Post not found or access denied.");
  }

  logger.info("Post deleted", { userId: user.id, postId: parsed.data.id });

  revalidatePath("/posts");
}
