import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url().optional(),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET should be at least 32 characters."),
  NEXTAUTH_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
});

let cachedEnv:
  | (z.infer<typeof serverEnvSchema> & z.infer<typeof clientEnvSchema>)
  | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const serverParsed = serverEnvSchema.safeParse(process.env);
  if (!serverParsed.success) {
    throw new Error(
      `Invalid server environment variables: ${serverParsed.error.message}`,
    );
  }

  const clientParsed = clientEnvSchema.safeParse(process.env);
  if (!clientParsed.success) {
    throw new Error(
      `Invalid client environment variables: ${clientParsed.error.message}`,
    );
  }

  cachedEnv = { ...serverParsed.data, ...clientParsed.data };
  return cachedEnv;
}
