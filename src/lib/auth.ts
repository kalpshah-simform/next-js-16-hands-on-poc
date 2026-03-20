import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations";

type TokenWithUserId = {
  userId?: string;
};

const env = getEnv();
const isProduction = process.env.NODE_ENV === "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  trustHost: true,
  useSecureCookies: isProduction,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 12,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse({
          email: String(credentials?.email ?? ""),
          password: String(credentials?.password ?? ""),
        });

        if (!parsed.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as typeof token & TokenWithUserId).userId = user.id as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userId = (token as typeof token & TokenWithUserId).userId;
        if (userId) {
          session.user = { ...session.user, id: userId };
        }
      }

      return session;
    },
  },
});

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  const userId = (user as typeof user & { id?: string }).id;
  if (!userId) {
    return null;
  }

  return {
    id: userId,
    name: user.name ?? null,
    email: user.email ?? null,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}
