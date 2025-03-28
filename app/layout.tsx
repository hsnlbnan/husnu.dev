import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

export const metadata: Metadata = {
  title: "Hüsnü Lübnan | Frontend & Javascript Developer",
  description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
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
    description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
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
    description: "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.",
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
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
