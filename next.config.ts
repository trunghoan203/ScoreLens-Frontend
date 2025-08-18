import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  images: {
    remotePatterns: [

      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/uploads/**",
      },

      {
        protocol: "https",
        hostname: "scorelens-backend.onrender.com",
        pathname: "/static/uploads/**",
      },
      {
        protocol: "https",
        hostname: "scorelens.io.vn",
        pathname: "/static/uploads/**",
      },
    ],
  },
};

export default nextConfig;
