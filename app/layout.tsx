import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hüsnü Lübnan | Frontend Developer",
  description: "Hüsnü Lübnan is a frontend developer based in Turkey.",
  openGraph: {
    title: "Hüsnü Lübnan | Frontend Developer",
    description: "Hüsnü Lübnan is a frontend developer based in Turkey.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hüsnü Lübnan | Frontend Developer",
      },
    ],
  },
  authors: [{ name: "Hüsnü Lübnan", url: "https://husnu.dev" }],
  creator: "Hüsnü Lübnan",
  publisher: "Hüsnü Lübnan",
  twitter: {
    site: "husnu.dev",
    creator: "@hsnlbnan",
    description: "Hüsnü Lübnan is a frontend developer based in Turkey.",
    title: "Hüsnü Lübnan | Frontend Developer",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hüsnü Lübnan | Frontend Developer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
