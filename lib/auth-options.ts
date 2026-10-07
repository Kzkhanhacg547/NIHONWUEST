import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Tự động bật AUTH_TRUST_HOST để NextAuth tự đọc request host header khi dùng ngrok / cloudflared / vercel / local IP
if (!process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

function requiredSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "NEXTAUTH_SECRET is missing or shorter than 32 characters. Set it before starting the server.",
    );
  }
  return secret;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: requiredSecret(),
  pages: { signIn: "/login", newUser: "/onboarding" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                access_type: "offline",
                prompt: "consent",
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 1. Cho phép các đường dẫn tương đối (vd: "/app", "/onboarding")
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // 2. Cho phép redirect nếu cùng origin/domain (kể cả ngrok, cloudflared, custom domain)
      try {
        const targetUrl = new URL(url);
        const baseObj = new URL(baseUrl);
        if (targetUrl.host === baseObj.host) {
          return url;
        }
      } catch {
        // url không hợp lệ
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) token.uid = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
};
