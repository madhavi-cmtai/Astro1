import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 50 * 1024 * 1024, // 50MB
    },
  },
  images: {
    domains: ["storage.googleapis.com"],
  }
};

export default nextConfig;
