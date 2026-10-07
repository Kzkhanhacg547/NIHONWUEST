import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBaseUrl } from "@/lib/get-base-url";

describe("getBaseUrl dynamic origin resolver", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("extracts host and proto from request headers with x-forwarded-host and x-forwarded-proto", () => {
    const req = new Request("https://internal.local/api/auth/callback/google", {
      headers: {
        "x-forwarded-host": "my-tunnel.trycloudflare.com",
        "x-forwarded-proto": "https",
      },
    });

    const url = getBaseUrl(req);
    expect(url).toBe("https://my-tunnel.trycloudflare.com");
  });

  it("handles ngrok / tunnel hosts with port or standard headers", () => {
    const req = new Request("http://localhost:3000/api/auth", {
      headers: {
        host: "abc1234.ngrok-free.app",
        "x-forwarded-proto": "https",
      },
    });

    const url = getBaseUrl(req);
    expect(url).toBe("https://abc1234.ngrok-free.app");
  });

  it("defaults to http for localhost host header when x-forwarded-proto is absent", () => {
    const req = new Request("http://localhost:3000/api/auth", {
      headers: {
        host: "localhost:3000",
      },
    });

    const url = getBaseUrl(req);
    expect(url).toBe("http://localhost:3000");
  });

  it("defaults to https for remote domains when x-forwarded-proto is absent", () => {
    const req = new Request("http://example.com/api/auth", {
      headers: {
        host: "demo.nihonquest.com",
      },
    });

    const url = getBaseUrl(req);
    expect(url).toBe("https://demo.nihonquest.com");
  });

  it("falls back to NEXTAUTH_URL if no request object is provided", () => {
    process.env.NEXTAUTH_URL = "https://custom-domain.com";
    delete process.env.VERCEL_URL;

    const url = getBaseUrl();
    expect(url).toBe("https://custom-domain.com");
  });

  it("falls back to VERCEL_URL if NEXTAUTH_URL is not defined", () => {
    delete process.env.NEXTAUTH_URL;
    process.env.VERCEL_URL = "nihon-quest.vercel.app";

    const url = getBaseUrl();
    expect(url).toBe("https://nihon-quest.vercel.app");
  });

  it("defaults to http://localhost:3000 if no req or env vars exist", () => {
    delete process.env.NEXTAUTH_URL;
    delete process.env.VERCEL_URL;

    const url = getBaseUrl();
    expect(url).toBe("http://localhost:3000");
  });
});

