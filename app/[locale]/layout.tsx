import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
// Only import Vercel analytics in production
import dynamic from 'next/dynamic';
import { notFound } from "next/navigation";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import {
  baseViewport,
  buildStructuredData,
  createMetadata,
  dnsPrefetchLinks,
  faviconLinks,
  preconnectLinks,
} from "@/config/seo";
import { isLocale, locales, localizedPath, siteOrigin, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

export const viewport = baseViewport;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  return createMetadata({ locale: params.locale, path: "/" });
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // [locale] segmenti her yolu yakalar; tanınmayan bir değer gelirse
  // (örn. /foo) 404 döndür, yoksa "foo" dilmiş gibi render ederdik.
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const structuredData = buildStructuredData(locale);

  return (
    <html
      lang={locale}
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

        {/* GEO: LLM crawler'ları için makine tarafından okunabilir bağlam.
            robots.txt'teki yorum satırı makineler için görünmez olduğundan
            llms.txt'i ayrıca burada duyuruyoruz. */}
        {/* NOT: burada bilinçli olarak `hrefLang` YOK. Bu bağlantı sayfanın
            başka bir DİLDEKİ sürümünü değil, başka bir BİÇİMDEKİ (text/plain)
            sürümünü işaret ediyor. `hrefLang` eklendiğinde doğrulayıcılar bunu
            bir dil alternatifi sanıp mutlak URL bekliyor ve hreflang setini
            geçersiz sayıyor. Dil alternatifleri metadata `alternates.languages`
            üzerinden üretiliyor. */}
        <link
          rel="alternate"
          type="text/plain"
          href={`${siteOrigin}${localizedPath(locale, "")}/llms.txt`.replace(
            /([^:])\/\//g,
            "$1/"
          )}
          title="llms.txt"
        />

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
      >
        {/* Erişilebilirlik: Skip to content link.
            Her route kendi <main id="main-content"> elementini render eder. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:top-2 focus:left-2 focus:font-bold"
        >
          {dict.layout.skipToContent}
        </a>

        <noscript>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 text-white">
            <p className="text-center text-lg px-4 py-2">{dict.layout.noScript}</p>
          </div>
        </noscript>

        {/* Performance Monitor - sadece geliştirme modunda görünür */}
        <PerformanceMonitor debug={process.env.NODE_ENV === 'development'} />

        {children}

        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
