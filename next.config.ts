import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  async redirects() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    if (basePath) {
      return [
        {
          source: "/",
          destination: `${basePath}/landing`,
          basePath: false,
          permanent: false,
        },
        {
          source: "/",
          destination: "/landing",
          permanent: false,
        },
      ];
    }
    return [
      {
        source: "/",
        destination: "/landing",
        permanent: false,
      },
    ];
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: "https://crm.cloudads.shop/api",
    NEXT_PUBLIC_API_BASE_URL: (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api",
    NEXT_PUBLIC_STORAGE_URL: "https://crm.cloudads.shop",
    NEXT_PUBLIC_ADMIN_URL: "https://admin.cloudads.shop",
    NEXT_PUBLIC_FRONT_URL: "https://cloudads.shop",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "crm.cloudads.shop",
      },
    ],
  },
};

export default nextConfig;
