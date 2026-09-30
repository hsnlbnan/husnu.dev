import type { Metadata, Viewport } from "next";
import { projects, work } from "@/data";
import {
  defaultLocale,
  localizedPath,
  locales,
  ogLocales,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

interface Project {
  title: string;
  subtitle: string;
  subtitleTr?: string;
  description: string;
  src: string;
  link?: string;
  company?: string;
}

interface WorkEntry {
  title: string;
  subtitle: string;
  subtitleTr?: string;
  description: string;
  src: string;
}

export interface LinkDefinition {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
}

export interface PageSeoOptions {
  /** Sayfanın dili. Canonical ve hreflang bunun üzerinden hesaplanır. */
  locale: Locale;
  /** Page specific title. Uses layout template automatically */
  title?: string;
  /** Optional description override */
  description?: string;
  /** Locale İÇERMEYEN yol: "/", "/liked", "/liked/preview/3" */
  path?: string;
  /** Override keywords */
  keywords?: string[];
  /** Primary preview image used for OpenGraph/Twitter */
  image?:
  | string
  | {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  /** Additional OpenGraph overrides */
  openGraph?: Partial<NonNullable<Metadata["openGraph"]>>;
  /** Additional Twitter overrides */
  twitter?: Partial<NonNullable<Metadata["twitter"]>>;
}

const siteUrl = "https://husnu.dev";
const siteName = "Hüsnü Lübnan";
const defaultDescription =
  "Hüsnü Lübnan engineers high-performance web applications with React, Next.js, and TypeScript, delivering robust solutions and interactive user experiences.";

const defaultKeywords = [
  "Hüsnü Lübnan",
  "Senior Frontend Developer Turkey",
  "Frontend Developer",
  "Javascript Developer",
  "React Developer",
  "Next.js Developer",
  "Typescript Developer",
  "Tailwind CSS Developer",
  "Hüsnü Lübnan kimdir",
  "Hüsnü Lübnan hakkında",
  "Hüsnü Lübnan blog",
  "Hüsnü Lübnan projeler",
  "Hüsnü Lübnan ile iletişime geç",
];

const defaultImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Hüsnü Lübnan | Frontend Developer",
};

// Next.js `viewport` export'u. Daha önce bu değer string olarak tanımlanıp hiç
// kullanılmıyordu; sonuç olarak `viewport-fit=cover` kayboluyor ve
// env(safe-area-inset-*) iOS'ta çalışmıyordu.
export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1D1D1D",
};

export const faviconLinks: LinkDefinition[] = [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
  { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
  { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
];

export const preconnectLinks: LinkDefinition[] = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export const dnsPrefetchLinks: LinkDefinition[] = [
  { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  { rel: "dns-prefetch", href: "https://cdn.vercel-insights.com" },
];

// Projeler ve iş geçmişi tek kaynaktan (data.js) türetilir. Daha önce schema
// elle yazıldığı için sayfada 6 proje / 5 iş kaydı görünürken schema'da yalnızca
// 3'er tane vardı — Google'ın "yapılandırılmış veri sayfada görünür olmalı"
// kuralına aykırıydı ve AI özetleri eksik veri görüyordu.
const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};

/** "June 2024" -> "2024-06". Tanınmazsa undefined. */
function toIsoMonth(value: string): string | undefined {
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  return month ? `${match[2]}-${month}` : undefined;
}

/** "June 2024 - Present" -> { startDate, endDate? } */
function parseDateRange(range: string): { startDate?: string; endDate?: string } {
  const [rawStart, rawEnd] = range.split("-").map((part) => part.trim());
  return {
    startDate: rawStart ? toIsoMonth(rawStart) : undefined,
    endDate: rawEnd && rawEnd.toLowerCase() !== "present" ? toIsoMonth(rawEnd) : undefined,
  };
}

function buildProjectListItems(locale: Locale) {
  return projects.map((project: Project, index: number) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: project.title,
      // Türkçe sayfada Türkçe açıklama; `inLanguage: "tr"` diyip İngilizce
      // metin vermek karışık dilli yapılandırılmış veri üretiyordu.
      description:
        locale === defaultLocale ? project.subtitle : project.subtitleTr ?? project.subtitle,
      ...(project.link ? { url: project.link } : {}),
      image: `${siteUrl}${project.src}`,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      inLanguage: locale,
      ...(project.company
        ? { creator: { "@type": "Organization", name: project.company } }
        : {}),
    },
  }));
}

function buildWorkListItems(locale: Locale) {
  return work.map((entry: WorkEntry, index: number) => {
    const { startDate, endDate } = parseDateRange(entry.description);
    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "OrganizationRole",
        roleName:
          locale === defaultLocale ? entry.subtitle : entry.subtitleTr ?? entry.subtitle,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        worksFor: { "@type": "Organization", name: entry.title },
      },
    };
  });
}

export function buildStructuredData(locale: Locale) {
  const dict = getDictionary(locale);
  const localeUrl = `${siteUrl}${localizedPath(locale, "/")}`;
  const projectListItems = buildProjectListItems(locale);
  const workListItems = buildWorkListItems(locale);

  return [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://husnu.dev/#person",
    name: siteName,
    url: siteUrl,
    jobTitle: dict.schema.jobTitle,
    description: dict.schema.personDescription,
    image: "https://husnu.dev/me.webp",
    email: "mailto:hsnlbnan@gmail.com",
    telephone: "+90 553 220 00 16",
    // Yalnızca ülke belirtiliyor; şehir bilgisi doğrulanmadığı için eklenmedi.
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    sameAs: [
      "https://github.com/hsnlbnan",
      "https://twitter.com/hsnlbnan",
      "https://www.linkedin.com/in/husnulubnan/",
    ],
    knowsAbout: [
      {
        "@type": "Thing",
        name: "Next.js App Router",
        description: "Advanced architecture with React Server Components",
      },
      {
        "@type": "Thing",
        name: "React.js",
        description: "Modern React patterns and hooks",
      },
      {
        "@type": "Thing",
        name: "TypeScript",
        description: "Strict typing and enterprise-scale development",
      },
      "Tailwind CSS",
      "Framer Motion",
      "Micro Frontend Architecture",
      "Web Performance Optimization (Core Web Vitals)",
      "Web Accessibility (WCAG)",
    ],
    nationality: {
      "@type": "Country",
      name: "Turkey",
    },
    // NOT: `alumniOf` kaldırıldı. "Frontend Developer Ecosystem Turkey" diye
    // bir kurum yok; var olmayan bir entity'e atıf spam sinyali üretebilir.
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://husnu.dev/#service",
    name: dict.schema.serviceName,
    url: siteUrl,
    image: "https://husnu.dev/og.png",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    areaServed: "Worldwide",
    description: dict.schema.serviceDescription,
    founder: {
      "@id": "https://husnu.dev/#person",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://husnu.dev/#website",
    url: localeUrl,
    name: siteName,
    inLanguage: locale,
    author: {
      "@id": "https://husnu.dev/#person",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.google.com/search?q=site%3Ahusnu.dev+{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://husnu.dev/#projects",
    name: dict.schema.projectsListName,
    description: "Featured web development projects",
    numberOfItems: projectListItems.length,
    itemListElement: projectListItems,
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://husnu.dev/#work-history",
    name: dict.schema.workListName,
    numberOfItems: workListItems.length,
    itemListElement: workListItems,
  },
  ];
}

export function buildBaseMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.siteTitleDefault,
      template: dict.meta.siteTitleTemplate,
    },
    description: dict.meta.description,
    keywords: [...dict.meta.keywords],
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: `${siteUrl}${localizedPath(locale, "/")}`.replace(/\/$/, "") || siteUrl,
      siteName,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      type: "website",
      images: [defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    twitter: {
      card: "summary_large_image",
      site: "@hsnlbnan",
      creator: "@hsnlbnan",
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      images: [defaultImage],
    },
  };
}

/**
 * Bir sayfa için tam metadata üretir.
 *
 * `path` DAİMA locale'siz yol olmalı ("/", "/liked", "/liked/preview/3").
 * Canonical ve hreflang bağlantıları buradan hesaplanır; böylece her sayfanın
 * kendi dilini gösteren canonical'ı ve diğer dile işaret eden alternate'i olur.
 */
export function createMetadata(options: PageSeoOptions): Metadata {
  const { locale, path = "/" } = options;
  const dict = getDictionary(locale);
  const base = buildBaseMetadata(locale);

  const canonical = `${siteUrl}${localizedPath(locale, path)}`;

  // hreflang: her dil + x-default (varsayılan dile işaret eder).
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteUrl}${localizedPath(l, path)}`;
  }
  languages["x-default"] = `${siteUrl}${localizedPath(defaultLocale, path)}`;

  const description = options.description ?? dict.meta.description;
  const keywords = options.keywords ?? [...dict.meta.keywords];
  const previewImage = options.image ?? defaultImage;

  const brandedTitle = options.title
    ? dict.meta.siteTitleTemplate.replace("%s", options.title)
    : dict.meta.siteTitleDefault;

  return {
    ...base,
    alternates: { canonical, languages },
    title: options.title ?? base.title,
    description,
    keywords,
    openGraph: {
      ...(base.openGraph ?? {}),
      title: brandedTitle,
      description,
      url: canonical,
      images: [previewImage],
    } as NonNullable<Metadata["openGraph"]>,
    twitter: {
      ...(base.twitter ?? {}),
      title: brandedTitle,
      description,
      images: [previewImage],
    } as NonNullable<Metadata["twitter"]>,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}
