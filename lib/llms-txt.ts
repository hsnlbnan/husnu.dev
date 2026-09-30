import { projects, work } from "@/data";
import { defaultLocale, localizedPath, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * llms.txt içeriğini TEK KAYNAKTAN üretir.
 *
 * Önceden `public/llms.txt` elle yazılıyordu ve kaçınılmaz olarak siteden
 * ayrışıyordu: deneyim yılı, proje listesi ve iş geçmişi iki yerde ayrı ayrı
 * tutuluyordu. Artık `data.js` + sözlükler neyse llms.txt de o; yeni bir proje
 * eklendiğinde ya da bir metin değiştiğinde otomatik güncelleniyor.
 *
 * https://llmstxt.org
 */

const SITE = "https://husnu.dev";

// Kariyer başlangıcı: data.js'teki en eski kayıt (Age Dijital Ajans, Mart 2021).
const CAREER_START = new Date(2021, 2);

function yearsOfExperience(now: Date) {
  const months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    (now.getMonth() - CAREER_START.getMonth());
  return Math.max(1, Math.floor(months / 12));
}

interface ProjectEntry {
  title: string;
  subtitle: string;
  subtitleTr?: string;
  description: string;
  link?: string;
  company?: string;
}

interface WorkEntry {
  title: string;
  subtitle: string;
  subtitleTr?: string;
  description: string;
  descriptionTr?: string;
  summary?: string;
  summaryTr?: string;
}

const COPY = {
  en: {
    intro: (years: number) =>
      `Hüsnü Lübnan is a Senior Frontend Developer based in Turkey, specializing in high-performance web applications with Next.js, React, TypeScript, and advanced UI/UX engineering with Framer Motion and TailwindCSS. ${years}+ years of professional experience (since March 2021).`,
    canonicalNote: `Canonical source: ${SITE} — this file is generated from the same data the site renders.`,
    languageNote: `Available in two languages: English at ${SITE} (default, this file) and Turkish at ${SITE}/tr (see ${SITE}/tr/llms.txt).`,
    about: "About",
    experience: "Experience",
    projectsHeading: "Projects",
    toolsHeading: "Tools on this site",
    linksHeading: "Links",
    noPublicUrl: "(No public URL — internal or client-owned product.)",
    stack:
      "JavaScript, TypeScript, Next.js (App Router), React Server Components, TailwindCSS, Framer Motion, Zustand, Redux Toolkit",
    specializations:
      "Core Web Vitals optimization, micro frontend architecture, design systems, SEO engineering, web accessibility (WCAG)",
    roleLabel: "Role",
    locationLabel: "Location",
    locationValue: "Turkey (remote / global)",
    stackLabel: "Stack",
    specializationsLabel: "Specializations",
    contactLabel: "Contact",
    tools: [
      {
        path: "/year-progress",
        name: "Year Progress",
        detail:
          "Generates a minimal, self-updating wallpaper showing the progress of the day, week, month, year, or any custom date. Installable on iOS via Shortcuts.",
      },
      {
        path: "/liked",
        name: "Liked Components",
        detail:
          "A curated collection of React + Framer Motion + Tailwind UI implementations, rebuilt for learning. Source code is not shared out of respect for the original designers.",
      },
      {
        path: "/ses",
        name: "Ses",
        detail:
          "An interactive iOS-inspired vertical volume control built with Framer Motion and Tailwind CSS.",
      },
    ],
  },
  tr: {
    intro: (years: number) =>
      `Hüsnü Lübnan, Türkiye'de yaşayan bir Senior Frontend Geliştirici. Next.js, React ve TypeScript ile yüksek performanslı web uygulamaları; Framer Motion ve TailwindCSS ile ileri seviye arayüz mühendisliği üzerine uzmanlaşmış. ${years}+ yıllık profesyonel deneyim (Mart 2021'den beri).`,
    canonicalNote: `Ana kaynak: ${SITE}/tr — bu dosya sitenin render ettiği veriden üretilir.`,
    languageNote: `İki dilde mevcut: İngilizce ${SITE} (varsayılan, bkz. ${SITE}/llms.txt) ve Türkçe ${SITE}/tr (bu dosya).`,
    about: "Hakkında",
    experience: "Deneyim",
    projectsHeading: "Projeler",
    toolsHeading: "Bu sitedeki araçlar",
    linksHeading: "Bağlantılar",
    noPublicUrl: "(Herkese açık URL yok — kuruma ait veya iç ürün.)",
    stack:
      "JavaScript, TypeScript, Next.js (App Router), React Server Components, TailwindCSS, Framer Motion, Zustand, Redux Toolkit",
    specializations:
      "Core Web Vitals optimizasyonu, mikro frontend mimarisi, tasarım sistemleri, SEO mühendisliği, web erişilebilirliği (WCAG)",
    roleLabel: "Rol",
    locationLabel: "Konum",
    locationValue: "Türkiye (uzaktan / global)",
    stackLabel: "Teknolojiler",
    specializationsLabel: "Uzmanlıklar",
    contactLabel: "İletişim",
    tools: [
      {
        path: "/year-progress",
        name: "Yıl İlerlemesi",
        detail:
          "Günün, haftanın, ayın, yılın veya seçilen herhangi bir tarihin ilerlemesini gösteren, kendini güncelleyen sade bir duvar kağıdı üretir. iOS'ta Kısayollar ile kurulabilir.",
      },
      {
        path: "/liked",
        name: "Beğendiğim Bileşenler",
        detail:
          "Öğrenmek amacıyla yeniden yazılmış React + Framer Motion + Tailwind arayüz bileşenlerinden oluşan seçki. Kaynak kodlar, özgün tasarımcılara saygıdan paylaşılmıyor.",
      },
      {
        path: "/ses",
        name: "Ses",
        detail:
          "Framer Motion ve Tailwind CSS ile geliştirilmiş, iOS'tan ilham alan etkileşimli dikey ses kontrolü.",
      },
    ],
  },
} as const;

export function buildLlmsTxt(locale: Locale, now = new Date()): string {
  const dict = getDictionary(locale);
  const copy = COPY[locale];
  const isDefault = locale === defaultLocale;
  const years = yearsOfExperience(now);
  const lines: string[] = [];

  lines.push("# Hüsnü Lübnan", "");
  lines.push(copy.intro(years), "");
  lines.push(`> ${copy.canonicalNote}`);
  lines.push(`> ${copy.languageNote}`);
  lines.push(`> Last generated: ${now.toISOString().slice(0, 10)}`, "");

  lines.push(`## ${copy.about}`, "");
  lines.push(`- ${copy.roleLabel}: ${dict.schema.jobTitle}`);
  lines.push(`- ${copy.locationLabel}: ${copy.locationValue}`);
  lines.push(`- ${copy.stackLabel}: ${copy.stack}`);
  lines.push(`- ${copy.specializationsLabel}: ${copy.specializations}`);
  lines.push(`- ${copy.contactLabel}: hsnlbnan@gmail.com`, "");

  lines.push(`## ${copy.experience}`, "");
  for (const entry of work as WorkEntry[]) {
    const role = isDefault ? entry.subtitle : entry.subtitleTr ?? entry.subtitle;
    const range = isDefault ? entry.description : entry.descriptionTr ?? entry.description;
    const summary = isDefault ? entry.summary : entry.summaryTr ?? entry.summary;
    lines.push(`- ${entry.title}: ${role} (${range})${summary ? ` — ${summary}` : ""}`);
  }
  lines.push("");

  lines.push(`## ${copy.projectsHeading}`, "");
  for (const project of projects as ProjectEntry[]) {
    const summary = isDefault ? project.subtitle : project.subtitleTr ?? project.subtitle;
    const heading = project.link
      ? `- [${project.title}](${project.link})`
      : `- ${project.title}`;
    const suffix = project.link ? "" : ` ${copy.noPublicUrl}`;
    const context = project.company ? ` (${project.company})` : "";
    lines.push(`${heading}${context}: ${summary} — ${project.description}.${suffix}`);
  }
  lines.push("");

  lines.push(`## ${copy.toolsHeading}`, "");
  for (const tool of copy.tools) {
    lines.push(`- [${tool.name}](${SITE}${localizedPath(locale, tool.path)}): ${tool.detail}`);
  }
  lines.push("");

  lines.push(`## ${copy.linksHeading}`, "");
  lines.push(`- Portfolio: ${SITE}${localizedPath(locale, "/")}`);
  for (const other of locales.filter((l) => l !== locale)) {
    lines.push(`- ${other.toUpperCase()}: ${SITE}${localizedPath(other, "/")}`);
  }
  lines.push("- GitHub: https://github.com/hsnlbnan");
  lines.push("- LinkedIn: https://www.linkedin.com/in/husnulubnan/");
  lines.push("- X: https://twitter.com/hsnlbnan");
  lines.push(`- Resume (PDF): ${SITE}/Husnu-Lubnan-CV.pdf`);
  lines.push("- Email: hsnlbnan@gmail.com");
  lines.push("");

  return lines.join("\n");
}
