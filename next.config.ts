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
      // {
      //   protocol: "https",
      //   hostname: "scorelens.io.vn",
      //   port: "",
      //   pathname: "/static/uploads/**",
      // },
    ],
  },
};

export default nextConfig;
