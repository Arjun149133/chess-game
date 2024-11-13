import type { NextConfig } from "next";
import { hostname } from "os";

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
