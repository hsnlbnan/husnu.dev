import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// Only import Vercel analytics in production
import dynamic from 'next/dynamic';
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Script from "next/script";
import { baseMetadata, dnsPrefetchLinks, faviconLinks, preconnectLinks, structuredData, viewportContent } from "@/config/seo";

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

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      className={`${inter.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {faviconLinks.map((link) => (
          <link
            key={`${link.rel}-${link.href}`}
            rel={link.rel}
            href={link.href}
            sizes={link.sizes}
            type={link.type}
            crossOrigin={link.crossOrigin}
          />
        ))}

        {preconnectLinks.map((link) => (
          <link
            key={`${link.rel}-${link.href}`}
            rel={link.rel}
            href={link.href}
            crossOrigin={link.crossOrigin}
          />
        ))}

        {dnsPrefetchLinks.map((link) => (
          <link key={`${link.rel}-${link.href}`} rel={link.rel} href={link.href} />
        ))}

        <meta name="viewport" content={viewportContent} />
        
        {/* Performance & SEO: Meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {structuredData.map((schema, index) => (
          <script
            key={`structured-data-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body 
        className={`${inter.className} antialiased bg-[#1D1D1D] text-white overflow-x-hidden`}
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
