import Header from '@/components/Header';
import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liked | Hüsnü Lübnan",
  description: "A curated collection of my favorite React and Tailwind CSS implementations that I've discovered and saved for inspiration.",
  keywords: [
    "React examples",
    "Tailwind CSS samples",
    "UI component collection",
    "Frontend code examples",
    "React UI inspiration",
    "Tailwind UI designs",
    "Code favorites",
  ],
  openGraph: {
    title: "Liked | Hüsnü Lübnan",
    description: "A curated collection of my favorite React and Tailwind CSS implementations that I've discovered and saved for inspiration.",
    images: [
      {
        url: "/og-liked.png",
        width: 1200,
        height: 630,
        alt: "My favorite React and Tailwind CSS implementations",
      },
    ],
  },
  authors: [{ name: "Hüsnü Lübnan", url: "https://husnu.dev" }],
  creator: "Hüsnü Lübnan",
  publisher: "Hüsnü Lübnan",
  twitter: {
    site: "husnu.dev",
    creator: "@hsnlbnan",
    description: "A curated collection of my favorite React and Tailwind CSS implementations that I've discovered and saved for inspiration.",
    title: "Liked | Hüsnü Lübnan",
    images: [
      {
        url: "/og-liked.png",
        width: 1200,
        height: 630,
        alt: "My favorite React and Tailwind CSS implementations",
      },
    ],
  },
};

export default function LikedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="w-full max-w-screen">
        <div className="md:mx-auto my-4 rounded-lg w-full lg:container">
          {children}
        </div>
      </div>
    </>
  )
}