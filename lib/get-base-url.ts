import type { NextRequest } from "next/server";

/**
 * Thuật toán tự động đọc và xác định Base URL (domain origin) linh hoạt theo environment & request thực tế.
 * - Client-side: Tự đọc window.location.origin.
 * - Server-side: Tự đọc header x-forwarded-host / host và x-forwarded-proto của request (hỗ trợ ngrok, cloudflared tunnel, Vercel preview, local network IP...).
 * - Fallback: NEXTAUTH_URL -> VERCEL_URL -> http://localhost:3000
 */
export function getBaseUrl(req?: Request | NextRequest | null): string {
  // 1. Phía Browser Client: Lấy origin thực tế trên trình duyệt hiện tại
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Phía Server: Tự động phân tích HTTP Request Headers
  if (req && req.headers) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const hostHeader = req.headers.get("host");
    const rawHost = forwardedHost || hostHeader || "";
    const host = rawHost.split(",")[0].trim();

    if (host) {
      const forwardedProto = req.headers.get("x-forwarded-proto");
      let proto = forwardedProto ? forwardedProto.split(",")[0].trim() : "";

      if (!proto) {
        const isLocal =
          host.includes("localhost") ||
          host.includes("127.0.0.1") ||
          host.startsWith("192.168.") ||
          host.startsWith("10.") ||
          host.startsWith("172.");
        proto = isLocal ? "http" : "https";
      }

      return `${proto}://${host}`;
    }
  }

  // 3. Phía Server khi không có req object: Đọc biến môi trường
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }
  if (process.env.URL) {
    const netlifyUrl = process.env.URL.replace(/\/$/, "");
    return netlifyUrl.startsWith("http") ? netlifyUrl : `https://${netlifyUrl}`;
  }
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL.replace(/\/$/, "");
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  // 4. Fallback mặc định
  return "http://localhost:3000";
}

