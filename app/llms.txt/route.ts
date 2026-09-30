import { buildLlmsTxt } from "@/lib/llms-txt";
import { defaultLocale } from "@/i18n/config";

// Varsayılan dil (İngilizce) kök URL'de: https://husnu.dev/llms.txt
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(defaultLocale), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
