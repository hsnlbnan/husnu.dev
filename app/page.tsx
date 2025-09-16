// Server component - istemci tarafı kod içermez
import ClientHome from "@/components/ClientHome";
import { createMetadata } from "@/config/seo";

// Statik sayfa optimizasyonu
export const dynamic = 'force-static';
export const revalidate = 86400; // 24 saat cachelensin
export const fetchCache = 'force-cache';

// SEO için metadata
export const metadata = createMetadata();

export default function Home() {
  return (
    <ClientHome />
  );
}
