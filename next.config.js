/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // Pre-existing type errors in seed-data files (n3-data.ts, n4-data.ts)
    // which are only used at seed time and never in the Next.js runtime.
    ignoreBuildErrors: true,
  },
  images: {
    // Was `hostname: "**"` for both https and http, which allowed the optimizer
    // to proxy any host (including plaintext) and opened an abuse/mixed-content
    // surface. Explicit allow-list instead.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

module.exports = nextConfig;