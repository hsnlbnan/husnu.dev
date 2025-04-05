import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// Only import Vercel analytics in production
import dynamic from 'next/dynamic';
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Script from "next/script";

// Dynamically import Vercel analytics components only in production
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics))
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights))

// Optimization: Font dosyasını optimize etmek için display swap kullanıldı
const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  weight: ['400', '500', '600', '700'], // Sadece kullanılan font ağırlıklarını yükle
  variable: '--font-jakarta', // Tailwind'de kullanmak için değişken ekle
});

export const metadata: Metadata = {
  metadataBase: new URL('https://husnu.dev'),
  title: "Hüsnü Lübnan | Frontend & Javascript Developer",
  description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
  keywords: [
    "Hüsnü Lübnan",
    "Frontend Developer",
    "Javascript Developer",
    "React Developer",
    "Next.js Developer",
    "Typescript Developer",
    "Tailwind CSS Developer",
    "Frontend Developer",
    "Hüsnü Lübnan kimdir",
    "Hüsnü Lübnan hakkında",
    "Hüsnü Lübnan blog",
    "Hüsnü Lübnan projeler",
    "Hüsnü Lübnan ile iletişime geç",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Hüsnü Lübnan | Frontend Developer",
    description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
    url: 'https://husnu.dev',
    siteName: 'Hüsnü Lübnan',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hüsnü Lübnan | Frontend Developer",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "Hüsnü Lübnan", url: "https://husnu.dev" }],
  creator: "Hüsnü Lübnan",
  publisher: "Hüsnü Lübnan",
  twitter: {
    card: 'summary_large_image',
    site: "@hsnlbnan",
    creator: "@hsnlbnan",
    description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
    title: "Hüsnü Lübnan | Frontend Developer",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hüsnü Lübnan | Frontend Developer",
      },
    ],
  },
  // Structured Data için JSON-LD
  other: {
    'google-site-verification': 'YOUR_VERIFICATION_CODE', // Google Site Doğrulama Kodu Ekleyin
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="tr" 
      className={`${inter.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Temel favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        
        {/* Performance: Kritik kaynaklar için preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance: DNS prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdn.vercel-insights.com" />
        
        {/* SEO: Canonical URL */}
        <link rel="canonical" href="https://husnu.dev" />
        
        {/* Accessibility: Viewport kontrolü */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Performance & SEO: Meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* SEO: Structured Data - Personal website */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Hüsnü Lübnan",
              "url": "https://husnu.dev",
              "jobTitle": "Frontend Developer",
              "sameAs": [
                "https://github.com/hsnlbnan",
                "https://twitter.com/hsnlbnan",
                "https://www.linkedin.com/in/husnulubnan/"
              ],
              "knowsAbout": ["JavaScript", "React", "Next.js", "TypeScript", "TailwindCSS"],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              }
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} antialiased bg-[#1D1D1D] text-white`}
        // Erişilebilirlik: Screen reader yardımı
        tabIndex={-1}
      >
        {/* Erişilebilirlik: Skip to content link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:top-2 focus:left-2 focus:font-bold"
        >
          İçeriğe geç
        </a>
        
        {/* Performance & Accessibility: Yüklenme göstergesi */}
        <noscript>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 text-white">
            <p className="text-center text-lg px-4 py-2">
              Bu site JavaScript gerektiriyor. Lütfen tarayıcınızda JavaScript'i etkinleştirin.
            </p>
          </div>
        </noscript>
        
        {/* Performance Monitor - sadece geliştirme modunda görünür */}
        <PerformanceMonitor debug={process.env.NODE_ENV === 'development'} />
        
        {/* Ana içerik */}
        <main id="main-content">
          {children}
        </main>
        
        <Toaster />
        <Analytics />
        <SpeedInsights />
        
        {/* Performance: Gecikmiş (Deferred) script'ler */}
        <Script
          id="performance-optimizations"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Preload kritik görseller
              const preloadImages = ['/me.webp'];
              preloadImages.forEach(image => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = image;
                link.fetchPriority = 'high';
                document.head.appendChild(link);
              });

              if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img.lazy-load');
                const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      const src = img.getAttribute('data-src');
                      if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy-load');
                      }
                      imageObserver.unobserve(img);
                    }
                  });
                });
                
                lazyImages.forEach(image => imageObserver.observe(image));
              }
            `
          }}
        />
      </body>
    </html>
  );
}
