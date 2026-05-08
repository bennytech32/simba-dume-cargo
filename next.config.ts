/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Inapuuza makosa ya ESLint wakati wa build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Inapuuza makosa ya TypeScript wakati wa build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;