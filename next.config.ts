import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TEMPORARY: allow images from any host so admins can paste arbitrary URLs.
    // Lock this down before production (e.g. restrict to Vercel Blob) — an
    // open optimizer lets anyone proxy images through your server.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
