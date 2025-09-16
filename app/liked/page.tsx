import LikedPageClient from "@/components/LikedPage/LikedPageClient";
import { createMetadata } from "@/config/seo";

export const dynamic = "force-static";

export const metadata = createMetadata({
  title: "Liked",
  description:
    "A curated collection of my favorite React and Tailwind CSS implementations that I've discovered and saved for inspiration.",
  path: "/liked",
  keywords: [
    "React examples",
    "Tailwind CSS samples",
    "UI component collection",
    "Frontend code examples",
    "React UI inspiration",
    "Tailwind UI designs",
    "Code favorites",
  ],
  image: {
    url: "/og-liked.png",
    width: 1200,
    height: 630,
    alt: "My favorite React and Tailwind CSS implementations",
  },
});

export default function LikedPage() {
  return <LikedPageClient />;
}
