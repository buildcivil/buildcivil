const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root — required for correct file tracing with pnpm
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async redirects() {
    return [
      {
        source: '/buildcivil-ai',
        destination: '/ai-cost-estimator',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'eehhwiujddtfibzywmzx.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
