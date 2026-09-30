export const siteOrigin = "https://husnu.dev";

export const locales = ["en", "tr"] as const;

export type Locale = (typeof locales)[number];

/**
 * Varsayılan dil kök URL'de servis edilir (prefix yok): husnu.dev/, /liked ...
 * Diğer diller prefix'li: husnu.dev/tr, /tr/liked ...
 *
 * Bu "as-needed" stratejisi bilinçli bir tercih: site zaten İngilizce olarak
 * indekslenmiş durumda ve tüm mevcut URL'ler aynen korunuyor. Herkesi /en
 * altına taşımak, biriken sıralamaları yeniden kazanmayı gerektirirdi.
 */
export const defaultLocale: Locale = "en";

/** OpenGraph `locale` alanı için BCP-47 karşılıkları. */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Bir locale + yol için genel URL üretir.
 * pathWithoutLocale her zaman "/" ile başlar ve locale içermez.
 */
export function localizedPath(locale: Locale, pathWithoutLocale: string): string {
  const clean = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  return locale === defaultLocale ? clean || "/" : `/${locale}${clean}`;
}
