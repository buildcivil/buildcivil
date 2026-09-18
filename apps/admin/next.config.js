const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root — required for correct file tracing with pnpm
  outputFileTracingRoot: path.join(__dirname, '../..'),
  // Shared CMS data-access layer ships raw TS from the workspace, not pre-built JS
  transpilePackages: ['@buildcivil/cms'],
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

module.exports = nextConfig;
