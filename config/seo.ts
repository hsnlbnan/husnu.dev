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
  "A frontend developer with 4+ years of experience developing web applications with React, Next.js, and TypeScript, specializing in enterprise projects, CMS systems, and interactive user interfaces.";

const defaultKeywords = [
  "Hüsnü Lübnan",
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
    name: siteName,
    url: siteUrl,
    jobTitle: "Frontend Developer",
    sameAs: [
      "https://github.com/hsnlbnan",
      "https://twitter.com/hsnlbnan",
      "https://www.linkedin.com/in/husnulubnan/",
    ],
    knowsAbout: ["JavaScript", "React", "Next.js", "TypeScript", "TailwindCSS"],
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: siteName,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.google.com/search?q=site%3Ahusnu.dev+{search_term_string}",
      "query-input": "required name=search_term_string",
    },
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
    locale: "tr_TR",
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
  other: {
    "google-site-verification": "YOUR_VERIFICATION_CODE",
  },
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
