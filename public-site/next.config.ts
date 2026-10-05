import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "storage.sokosuite.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.bookwithsheilla.com",
      },
    ],
  },
  // Allow dev origins for Next.js image optimizer
  allowedDevOrigins: ["http://localhost:5002"],
};

export default nextConfig;
