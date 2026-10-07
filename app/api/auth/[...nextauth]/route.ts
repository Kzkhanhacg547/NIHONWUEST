import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getBaseUrl } from "@/lib/get-base-url";
import type { NextRequest } from "next/server";

async function authHandler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  // Đọc linh hoạt domain/host thực tế từ HTTP request headers (hỗ trợ ngrok, cloudflared, vercel preview, local network IP...)
  const dynamicOrigin = getBaseUrl(req);
  if (dynamicOrigin && typeof process !== "undefined") {
    process.env.NEXTAUTH_URL = dynamicOrigin;
  }
  return NextAuth(req, ctx, authOptions);
}

export { authHandler as GET, authHandler as POST };
