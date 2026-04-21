import { PreviewRouteClient } from "@/components/LikedComponents/PreviewRouteClient";
import { createMetadata, createBreadcrumbJsonLd } from "@/config/seo";
import { likedComponents } from "@/data/likedComponents";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return likedComponents.map((component) => ({ id: component.id.toString() }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = Number(params.id);
  const component = likedComponents.find((item) => item.id === id);

  return createMetadata({
    title: component ? `${component.title} Preview` : "Liked Preview",
    description: component?.description ?? "Preview detail showcasing interactive UI components from my liked collection.",
    path: `/liked/preview/${params.id}`,
  });
}

export default function PreviewPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const component = likedComponents.find((item) => item.id === id);

  if (!component) {
    notFound();
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", url: "https://husnu.dev/" },
    { name: "Liked Components", url: "https://husnu.dev/liked" },
    { name: component.title, url: `https://husnu.dev/liked/preview/${component.id}` },
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
