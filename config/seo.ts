import type { Metadata } from "next";

export interface LinkDefinition {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
}

export interface PageSeoOptions {
  /** Page specific title. Uses layout template automatically */
  title?: string;
  /** Optional description override */
  description?: string;
  /** Canonical path ("/about") or full URL */
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

export const viewportContent = "width=device-width, initial-scale=1, viewport-fit=cover";

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

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://husnu.dev/#person",
    name: siteName,
    url: siteUrl,
    jobTitle: "Senior Frontend Developer",
    description: "Senior Frontend Developer in Turkey, specializing in Next.js, React, and high-performance web architecture.",
    image: "https://husnu.dev/me.webp",
    sameAs: [
      "https://github.com/hsnlbnan",
      "https://twitter.com/hsnlbnan",
      "https://www.linkedin.com/in/husnulubnan/",
      "https://husnu.dev"
    ],
    knowsAbout: [
      {
        "@type": "Thing",
        name: "Next.js App Router",
        description: "Advanced architecture with React Server Components"
      },
      {
        "@type": "Thing",
        name: "React.js",
        description: "Modern React patterns and hooks"
      },
      {
        "@type": "Thing",
        name: "TypeScript",
        description: "Strict typing and enterprise-scale development"
      },
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
      "Web Performance Optimization (Core Web Vitals)",
      "Generative Engine Optimization (GEO)"
    ],
    nationality: {
      "@type": "Country",
      name: "Turkey"
    },
    alumniOf: {
      "@type": "Organization",
      name: "Frontend Developer Ecosystem Turkey"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://husnu.dev/#service",
    name: "Hüsnü Lübnan - Frontend Consultancy",
    url: siteUrl,
    image: "https://husnu.dev/og.png",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR"
    },
    description: "Professional frontend development and consultancy services for enterprise-grade React and Next.js applications.",
    founder: {
      "@id": "https://husnu.dev/#person"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: siteName,
    author: {
      "@id": "https://husnu.dev/#person"
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
    name: "Projects by Hüsnü Lübnan",
    description: "Featured web development projects",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "Otokoç 2. El",
          description: "Used car sales platform for Koç Holding with micro frontend architecture",
          url: "https://www.otokocikinciel.com/",
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          programmingLanguage: "TypeScript",
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "Fizbot",
          description: "Real estate intelligence platform with map-based opportunity matching",
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          programmingLanguage: "TypeScript",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "SoftwareApplication",
          name: "hayal.in",
          description: "Anonymous dream sharing platform with edge-first architecture",
          url: "https://hayal.in",
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          programmingLanguage: "TypeScript",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://husnu.dev/#work-history",
    name: "Work Experience - Hüsnü Lübnan",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "OrganizationRole",
          roleName: "Frontend Developer",
          startDate: "2024-06",
          worksFor: { "@type": "Organization", name: "Nuevo Software House" },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "OrganizationRole",
          roleName: "Frontend Developer",
          startDate: "2023-10",
          endDate: "2024-06",
          worksFor: { "@type": "Organization", name: "SHFT" },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "OrganizationRole",
          roleName: "Frontend Developer",
          startDate: "2022-09",
          endDate: "2023-10",
          worksFor: { "@type": "Organization", name: "NoNo Company" },
        },
      },
    ],
  },
];

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Frontend & Javascript Developer`,
    template: "%s | Hüsnü Lübnan",
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} | Frontend Developer`,
    description: defaultDescription,
    url: siteUrl,
    siteName: siteName,
    locale: "en_US",
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
    title: `${siteName} | Frontend Developer`,
    description: defaultDescription,
    images: [defaultImage],
  },
  other: {},
};

export function createMetadata(options: PageSeoOptions = {}): Metadata {
  const canonical = options.path?.startsWith("http")
    ? options.path
    : new URL(options.path ?? "/", siteUrl).toString();

  const description = options.description ?? baseMetadata.description ?? defaultDescription;
  const keywords = options.keywords ?? baseMetadata.keywords ?? defaultKeywords;

  const baseTitle = baseMetadata.title;
  let fallbackTitle: string | undefined = options.title;

  if (!fallbackTitle) {
    if (typeof baseTitle === "string") {
      fallbackTitle = baseTitle;
    } else if (baseTitle && typeof baseTitle === "object") {
      const defaultCandidate = (baseTitle as { default?: unknown }).default;
      if (typeof defaultCandidate === "string") {
        fallbackTitle = defaultCandidate;
      } else if (defaultCandidate != null) {
        fallbackTitle = String(defaultCandidate);
      }
    }

    if (!fallbackTitle) {
      const ogTitle = baseMetadata.openGraph?.title;
      if (typeof ogTitle === "string") {
        fallbackTitle = ogTitle;
      } else if (ogTitle != null) {
        fallbackTitle = String(ogTitle);
      }
    }
  }

  const template =
    baseTitle && typeof baseTitle === "object" && "template" in baseTitle
      ? (() => {
        const rawTemplate = (baseTitle as { template?: unknown }).template;
        if (!rawTemplate) return undefined;
        return typeof rawTemplate === "string" ? rawTemplate : String(rawTemplate);
      })()
      : undefined;

  const resolvedFallbackTitle = fallbackTitle ?? `${siteName} | Frontend Developer`;

  const brandedTitle = options.title && template ? template.replace("%s", options.title) : resolvedFallbackTitle;

  const baseImages = baseMetadata.openGraph?.images;
  const baseImage = Array.isArray(baseImages) ? baseImages[0] : baseImages;
  const previewImage = options.image ?? baseImage ?? defaultImage;

  const openGraph = {
    ...(baseMetadata.openGraph ?? {}),
    ...options.openGraph,
    title: options.openGraph?.title ?? brandedTitle,
    description: options.openGraph?.description ?? description,
    url: canonical,
    images: options.openGraph?.images ?? (previewImage ? [previewImage] : undefined),
  } as NonNullable<Metadata["openGraph"]>;

  const twitter = {
    ...(baseMetadata.twitter ?? {}),
    ...options.twitter,
    title: options.twitter?.title ?? brandedTitle,
    description: options.twitter?.description ?? description,
    images: options.twitter?.images ?? (previewImage ? [previewImage] : undefined),
  } as NonNullable<Metadata["twitter"]>;

  return {
    ...baseMetadata,
    alternates: { canonical },
    title: options.title ?? baseMetadata.title,
    description,
    keywords,
    openGraph,
    twitter,
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
