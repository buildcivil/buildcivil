import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root — required for correct file tracing with pnpm
  outputFileTracingRoot: path.join(__dirname, '../..'),
  // Temporary: React 18 (renovaite) coexists with React 19 apps, so dual
  // @types/react versions produce false positives during `next build`.
  // Remove after upgrading renovaite to React 19 / Next 15.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
