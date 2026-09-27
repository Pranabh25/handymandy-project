import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    serverActions: {
      // Product image uploads go through a route handler, but allow a little headroom.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
