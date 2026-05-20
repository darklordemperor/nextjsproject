import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://laravel-api:80/api/:path*",
      },
      {
        source: "/sanctum/:path*",
        destination: "http://laravel-api:80/sanctum/:path*",
      },
    ];
  },
};

export default nextConfig;
