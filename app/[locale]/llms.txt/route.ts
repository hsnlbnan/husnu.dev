import { buildLlmsTxt } from "@/lib/llms-txt";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

// Prefix'li diller: https://husnu.dev/tr/llms.txt
//
// NOT: middleware uzantılı yolları (.txt) atladığı için bu route'a istek
// doğrudan geliyor; varsayılan dil kök URL'de servis edildiğinden /en/llms.txt
// 404 döner ve çift içerik oluşmaz.
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

export function GET(_request: Request, { params }: { params: { locale: string } }) {
  if (!isLocale(params.locale) || params.locale === defaultLocale) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildLlmsTxt(params.locale), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
