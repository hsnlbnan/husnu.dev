import { PreviewRouteClient } from "@/components/LikedComponents/PreviewRouteClient";
import { createMetadata, createBreadcrumbJsonLd } from "@/config/seo";
import { likedComponents } from "@/data/likedComponents";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, localizedPath, locales, type Locale } from "@/i18n/config";
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

  return createMetadata({
    locale,
    title: component ? `${component.title} Preview` : dict.liked.title,
    description: component?.description ?? dict.liked.description,
    path: `/liked/preview/${params.id}`,
  });
}

export default function PreviewPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const id = Number(params.id);
  const component = likedComponents.find((item) => item.id === id);

  if (!component) {
    notFound();
  }

  const origin = "https://husnu.dev";
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", url: `${origin}${localizedPath(locale, "/")}` },
    { name: dict.liked.heading, url: `${origin}${localizedPath(locale, "/liked")}` },
    {
      name: component.title,
      url: `${origin}${localizedPath(locale, `/liked/preview/${component.id}`)}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <PreviewRouteClient id={component.id} mode="page" />
    </>
  );
}
