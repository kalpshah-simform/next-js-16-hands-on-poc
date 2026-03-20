"use server";

import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, signupSchema } from "@/lib/validations";

export type AuthActionState = {
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

function sanitizeRedirectPath(
  nextPath: string | null | undefined,
  fallback: string,
): string {
  if (!nextPath) {
    return fallback;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      message: "An account with this email already exists.",
      fieldErrors: {
        email: ["Use a different email address."],
      },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
    });
  } catch (error) {
    logger.error("Signup persistence failed", {
      email: parsed.data.email,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      message: "Unable to create account at the moment. Please try again.",
    };
  }

  logger.info("User account created", { email: parsed.data.email });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn("Signup auto-login failed", { email: parsed.data.email });
      return {
        message:
          "Signup succeeded, but automatic login failed. Please log in manually.",
      };
    }

    throw error;
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const redirectTo = sanitizeRedirectPath(
    String(formData.get("next") ?? ""),
    "/dashboard",
  );

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Invalid email or password.",
      };
    }

    logger.error("Login failed due to unexpected error", {
      email: parsed.data.email,
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

export async function logoutAction() {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    logger.error("Logout failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
