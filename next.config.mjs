/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for best practices and performance
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Optimize page load performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable SWC minification instead of Terser for faster builds
  swcMinify: true,

  // Scroll restoration for navigation
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
