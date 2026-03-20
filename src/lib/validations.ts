import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Email is invalid.").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export const loginSchema = z.object({
  email: z.email("Email is invalid.").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(120),
  content: z.string().max(5000).optional(),
});

export const updatePostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(120).optional(),
  content: z.string().max(5000).optional(),
});
