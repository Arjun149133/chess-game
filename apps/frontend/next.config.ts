import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.chess.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
