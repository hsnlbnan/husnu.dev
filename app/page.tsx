// Server component - istemci tarafı kod içermez
import ClientHome from "@/components/ClientHome";
import { Metadata } from "next";

// Statik sayfa optimizasyonu
export const dynamic = 'force-static';
export const revalidate = 86400; // 24 saat cachelensin
export const fetchCache = 'force-cache';

// SEO için metadata
export const metadata: Metadata = {
  title: "Hüsnü Lübnan | Frontend Developer",
  description: "Frontend developer with expertise in React, Next.js, and TypeScript, building enterprise projects and user interfaces.",
};

export default function Home() {
  return (
    <ClientHome />
  );
}
