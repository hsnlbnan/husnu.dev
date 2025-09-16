import { PreviewRouteClient } from "@/components/LikedComponents/PreviewRouteClient";
import { createMetadata } from "@/config/seo";
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

  const base = createMetadata({
    title: component ? `${component.title} Preview` : "Liked Preview",
    description: component?.description ?? "Preview detail showcasing interactive UI components from my liked collection.",
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
