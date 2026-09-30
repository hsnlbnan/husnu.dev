/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for best practices and performance
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    // 60sn çok kısaydı; tüm görseller statik ve içerik hash'li.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // `domains` deprecated; uzak görsel kullanılmıyor.
    remotePatterns: [],
    // Uzak kaynak olmadığı için SVG optimizasyonuna izin vermeye gerek yok.
    // Açık bırakmak, ileride bir remotePattern eklendiğinde XSS vektörü olur.
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
    optimizeCss: false, // CSS optimizasyonu
    forceSwcTransforms: true,
  },

  // HTTP headers for better security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // NOT: X-XSS-Protection kaldırıldı. Modern tarayıcılarda desteği
          // sonlandırıldı ve bazı durumlarda kendisi bir güvenlik açığı
          // oluşturuyor. Yerine CSP kullanılıyor.
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Clickjacking koruması. frame-ancestors modern tarayıcılarda
          // geçerli, X-Frame-Options eski tarayıcılar için yedek.
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // JSON-LD ve Next.js hydration inline script kullanır.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://va.vercel-scripts.com https://cdn.vercel-insights.com",
              // Tailwind/Framer Motion inline style üretir.
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://app.cal.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src 'self' https://app.cal.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },

  // Redirect ve rewrites için
  async redirects() {
    return [
      // Gerekirse eski URL'lerden yenilerine yönlendirmeler eklenebilir
    ];
  },
};

export default nextConfig;
