/**
 * Next.js config — static export so the site can deploy to GitHub Pages or any
 * static host. If you serve from `https://<user>.github.io/portfolio/`, set the
 * env var `NEXT_PUBLIC_BASE_PATH=/portfolio` before `npm run build`.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // R3F / three-mesh-bvh ship ES modules — these flags keep Next 15 happy.
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
