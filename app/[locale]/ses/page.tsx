import { createMetadata } from "@/config/seo";
import VolumePage from "@/components/Volume";
import Header from "@/components/Header";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

const KEYWORDS: Record<Locale, string[]> = {
  en: [
    "iOS volume slider",
    "Framer Motion slider",
    "Tailwind CSS volume control",
    "React interaction demo",
  ],
  tr: [
    "iOS ses kaydırıcı",
    "Framer Motion slider",
    "Tailwind CSS ses kontrolü",
    "React etkileşim demosu",
  ],
};

export function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createMetadata({
    locale,
    title: dict.ses.title,
    description: dict.ses.description,
    path: "/ses",
    keywords: KEYWORDS[locale],
  });
}

function SesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      {/* Sayfa sitemap'te olduğu için doğrudan arama sonucundan gelen
          ziyaretçinin portfolyoya dönebilmesi gerekiyor; daha önce hiçbir
          navigasyon yoktu. */}
      <div className="px-4 md:px-0">
        <Header locale={locale} dict={dict} />
      </div>
      <main id="main-content">
        <h1 className="sr-only">{dict.ses.h1}</h1>
        <VolumePage />
      </main>
    </>
  );
}

export default SesPage;
