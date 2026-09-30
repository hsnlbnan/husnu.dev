import { PreviewRouteClient } from "@/components/LikedComponents/PreviewRouteClient";
import { createMetadata } from "@/config/seo";
import { likedComponents } from "@/data/likedComponents";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    likedComponents.map((component) => ({ locale, id: component.id.toString() }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const id = Number(params.id);
  const component = likedComponents.find((item) => item.id === id);

  const base = createMetadata({
    locale,
    title: component ? `${component.title} Preview` : dict.liked.title,
    description: component?.description ?? dict.liked.description,
    path: `/liked/preview/${params.id}`,
  });

  return {
    ...base,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function InterceptedPreviewPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const component = likedComponents.find((item) => item.id === id);

  if (!component) {
    notFound();
  }

  return <PreviewRouteClient id={component.id} mode="modal" />;
}
