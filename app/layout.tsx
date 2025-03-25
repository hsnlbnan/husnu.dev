import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hüsnü Lübnan | Frontend & Javascript Developer",
  description: "React, Next.js ve TypeScript ile web uygulamaları geliştiren, kurumsal projeler, CMS sistemleri ve interaktif kullanıcı arayüzleri konusunda çalışmalar yapan 4+ yıllık deneyime sahip bir frontend developer.",
  keywords: [
    "Hüsnü Lübnan",
    "Frontend Developer",
    "Javascript Developer",
    "React Developer",
    "Next.js Developer",
    "Typescript Developer",
    "Tailwind CSS Developer",
    "Frontend Developer",
    "Hüsnü Lübnan kimdir",
    "Hüsnü Lübnan hakkında",
    "Hüsnü Lübnan blog",
    "Hüsnü Lübnan projeler",
    "Hüsnü Lübnan ile iletişime geç",

  ],
  openGraph: {
    title: "Hüsnü Lübnan | Frontend Developer",
    description: "React, Next.js ve TypeScript ile web uygulamaları geliştiren, kurumsal projeler, CMS sistemleri ve interaktif kullanıcı arayüzleri konusunda çalışmalar yapan 4+ yıllık deneyime sahip bir frontend developer.",
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
    description: "React, Next.js ve TypeScript ile web uygulamaları geliştiren, kurumsal projeler, CMS sistemleri ve interaktif kullanıcı arayüzleri konusunda çalışmalar yapan 4+ yıllık deneyime sahip bir frontend developer.",
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
