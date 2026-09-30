import LikedPageClient from "@/components/LikedPage/LikedPageClient";
import { createMetadata } from "@/config/seo";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const KEYWORDS: Record<Locale, string[]> = {
  en: [
    "React examples",
    "Tailwind CSS samples",
    "UI component collection",
    "Frontend code examples",
    "React UI inspiration",
    "Tailwind UI designs",
  ],
  tr: [
    "React örnekleri",
    "Tailwind CSS örnekleri",
    "UI bileşen koleksiyonu",
    "Frontend kod örnekleri",
    "React arayüz ilhamı",
    "Tailwind UI tasarımları",
  ],
};

export function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createMetadata({
    locale,
    title: dict.liked.title,
    description: dict.liked.description,
    path: "/liked",
    keywords: KEYWORDS[locale],
    image: {
      url: "/og-liked.png",
      width: 1200,
      height: 630,
      alt: dict.liked.heading,
    },
  });
}

export default function LikedPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return <LikedPageClient dict={getDictionary(locale)} />;
}
