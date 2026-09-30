import "./styles.css";
import Header from "@/components/Header";
import { createMetadata } from "@/config/seo";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

const KEYWORDS: Record<Locale, string[]> = {
  en: [
    "year progress wallpaper",
    "iOS shortcuts wallpaper",
    "progress bar wallpaper generator",
    "year progress bar",
    "minimal wallpaper generator",
  ],
  tr: [
    "yıl ilerlemesi duvar kağıdı",
    "iOS kısayol duvar kağıdı",
    "ilerleme çubuğu duvar kağıdı",
    "yıl ilerleme çubuğu",
    "sade duvar kağıdı oluşturucu",
  ],
};

export function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createMetadata({
    locale,
    title: dict.yearProgress.title,
    description: dict.yearProgress.description,
    path: "/year-progress",
    keywords: KEYWORDS[locale],
  });
}

export default function YearProgressLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  // Bu route bir araç; ana sayfanın Person/ItemList şeması onu tarif etmiyordu.
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://husnu.dev/year-progress#app",
    name: "Year Progress Wallpaper Generator",
    url: `https://husnu.dev${localizedPath(locale, "/year-progress")}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web, iOS (via Shortcuts)",
    inLanguage: locale,
    description: dict.yearProgress.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": "https://husnu.dev/#person" },
    isPartOf: { "@id": "https://husnu.dev/#website" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      {/* Site header so visitors landing here (e.g. from a shared link) can reach
          the portfolio. Sits on the tool's default dark bg so it reads as one
          surface; if the tool is themed light, this stays a dark nav strip. */}
      <div className="yp-header-shell">
        <div className="yp-header-inner">
          <Header locale={locale} dict={dict} />
        </div>
      </div>
      <main id="main-content">{children}</main>
    </>
  );
}
