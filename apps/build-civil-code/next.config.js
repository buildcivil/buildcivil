const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root — required for correct file tracing with pnpm
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async redirects() {
    const aiAppUrl = process.env.NEXT_PUBLIC_AI_COST_ESTIMATOR_URL || 'https://ai.buildcivil.in'
    return [
      {
        source: '/buildcivil-ai',
        destination: aiAppUrl,
        permanent: true,
      },
      {
        source: '/ai-cost-estimator',
        destination: aiAppUrl,
        permanent: true,
      },
      {
        source: '/ai-cost-estimator/:path*',
        destination: aiAppUrl,
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
