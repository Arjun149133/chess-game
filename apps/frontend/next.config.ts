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
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://locahost:5000/:path*",
      },
    ];
  },
};

export default nextConfig;
