const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async redirects() {
    return [
      {
        source: '/buildcivil-ai',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ai-cost-estimator',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
