"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const LABELS: Record<Locale, string> = { en: "EN", tr: "TR" };

/**
 * Mevcut yoldan locale prefix'ini ayıklar.
 * "/tr/liked" -> "/liked", "/liked" -> "/liked", "/tr" -> "/"
 */
function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
  }
  return pathname || "/";
}

function hrefFor(locale: Locale, pathname: string): string {
  const base = stripLocale(pathname);
  if (locale === defaultLocale) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

export default function LanguageSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label={dict.header.languageSwitcher}
      className="flex items-center gap-0.5 rounded-lg bg-[#111] p-0.5"
    >
      {locales.map((target) => {
        const isActive = target === locale;
        return (
          <Link
            key={target}
            href={hrefFor(target, pathname)}
            hrefLang={target}
            // Aktif dil için aria-current; ekran okuyucu hangisinin seçili
            // olduğunu yalnızca renkten anlayamaz.
            aria-current={isActive ? "true" : undefined}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff1f] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              isActive
                ? "bg-[#dfff1f] text-black"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {/* aria-label YERİNE sr-only ek: erişilebilir ad görünen metni
                ("TR") İÇERMELİ, yoksa sesli komut kullanıcısı "TR'ye tıkla"
                diyemez (WCAG 2.5.3 Label in Name). */}
            {LABELS[target]}
            <span className="sr-only"> — {dict.header.localeNames[target]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
