import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  serverExternalPackages: ["better-sqlite3", "bcryptjs"],
  async redirects() {
    return [
      { source: "/t/:slug", destination: "/", permanent: false },
      { source: "/t/:slug/:id", destination: "/imoveis/:id", permanent: false },
      { source: "/register", destination: "/login", permanent: false },
      { source: "/pricing", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
