import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporary: React 18 (renovaite) coexists with React 19 apps, so dual
  // @types/react versions produce false positives during `next build`.
  // Remove after upgrading renovaite to React 19 / Next 15.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Monorepo root — required for correct file tracing with pnpm.
    // Next 14 only accepts this nested under `experimental` (it moved
    // top-level in Next 15, which is where the other apps set it).
    outputFileTracingRoot: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
