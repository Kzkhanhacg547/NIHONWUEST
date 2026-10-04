import { NextResponse } from "next/server";

/**
 * In-memory fixed-window rate limiter.
 *
 * The project had no rate limiting on any endpoint: login, register, OTP send,
 * OTP verify and the AI routes were all unlimited. This is intentionally
 * dependency-free and per-process; a multi-instance deployment would need a
 * shared store (Redis) behind the same interface.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bound memory: drop expired buckets periodically instead of growing forever.
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count };
}

/** Best-effort client identity from proxy headers. */
export function clientKey(req: Request, scope: string): string {
  const headers = req.headers;
  const forwarded = headers.get("x-forwarded-for");
  const ip =
    (forwarded ? forwarded.split(",")[0]?.trim() : null) ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown";
  return `${scope}:${ip}`;
}

/** Standard 429 response with a Retry-After header. */
export function rateLimited(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Vui lòng thử lại sau." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

/** Convenience guard: returns a 429 response when the limit is exceeded. */
export function enforceRateLimit(req: Request, scope: string, limit: number, windowMs: number) {
  const result = rateLimit(clientKey(req, scope), limit, windowMs);
  if (!result.ok) return rateLimited(result.retryAfterSeconds);
  return null;
}