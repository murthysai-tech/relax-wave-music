import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'v3.jamendo.com',
      },
      {
        protocol: 'https',
        hostname: 'imgs2.jamendo.com',
      },
    ],
  },
};

export default nextConfig;
