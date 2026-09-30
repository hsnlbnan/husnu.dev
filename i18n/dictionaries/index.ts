import type { Locale } from "../config";
import en from "./en";
import tr from "./tr";

export type Dictionary = typeof en;

/**
 * Sözlükler statik olarak import edilir (dynamic import değil): tamamı birkaç
 * KB metin ve sayfalar `force-static` olduğu için build zamanında gömülüyor.
 * Böylece hem RSC hem client bileşenleri aynı nesneyi kullanabiliyor.
 *
 * `tr.ts` içinde `const tr: typeof en` bildirimi olduğundan, bir anahtar
 * eksik kalırsa veya fazladan eklenirse `tsc` hata verir.
 */
const dictionaries: Record<Locale, Dictionary> = { en, tr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** "Visit {title} project" + { title: "Fizbot" } -> "Visit Fizbot project" */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}
