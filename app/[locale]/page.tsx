// Server component - istemci tarafı kod içermez
import ClientHome from "@/components/ClientHome";
import { createMetadata } from "@/config/seo";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

// Statik sayfa optimizasyonu
export const dynamic = 'force-static';
export const revalidate = 86400; // 24 saat cachelensin
export const fetchCache = 'force-cache';

// SEO için metadata
export function generateMetadata({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return {};
  return createMetadata({ locale: params.locale, path: "/" });
}

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return <ClientHome locale={locale} dict={getDictionary(locale)} />;
}
