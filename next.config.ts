import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cho phép ảnh từ localhost:8000 (dev)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/uploads/**",
      },

      // Cho phép ảnh từ scorelens.io.vn để deploy BE r sửa (prod)
      {
        protocol: "https",
        hostname: "https://scorelens-backend.onrender.com",
        pathname: "/static/uploads/**",
      },
      {
        protocol: "https",
        hostname: "https://scorelens.io.vn",
        pathname: "/static/uploads/**",
      },
    ],
  },
};

export default nextConfig;
