import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * "as-needed" locale prefix yönlendirmesi.
 *
 *   /            -> app/[locale]/page.tsx        (locale = "en", URL değişmez)
 *   /liked       -> app/[locale]/liked/page.tsx  (locale = "en", URL değişmez)
 *   /tr          -> app/[locale]/page.tsx        (locale = "tr")
 *   /tr/liked    -> app/[locale]/liked/page.tsx  (locale = "tr")
 *   /en/liked    -> 308 -> /liked                (çift içerik oluşmasın)
 *
 * İngilizce kök URL'de kaldığı için mevcut tüm bağlantılar, sıralamalar ve
 * paylaşılmış linkler aynen çalışmaya devam ediyor.
 */

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Varsayılan dil hiçbir zaman URL'de görünmemeli; görünürse kalıcı olarak
  // prefix'siz sürüme yönlendir.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const stripped = pathname.slice(`/${defaultLocale}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // Prefix yok -> varsayılan dile iç yönlendirme (rewrite: URL değişmez).
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // API route'ları, Next.js iç dosyaları ve uzantılı statik dosyalar hariç
  // her istek middleware'den geçer.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
