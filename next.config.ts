import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
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
