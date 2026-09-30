import { MetadataRoute } from 'next';
import { likedComponents } from '@/data/likedComponents';
import { defaultLocale, localizedPath, locales } from '@/i18n/config';

const baseUrl = 'https://husnu.dev';

// Build zamanı damgası. Sabit bir tarih yerine her deploy'da tazelenir, böylece
// lastmod gerçek bir sinyal taşır.
const lastModified = new Date();

/** Locale içermeyen yollar; her biri her dil için ayrı girdi üretir. */
const ROUTES = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/liked', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/year-progress', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/ses', priority: 0.6, changeFrequency: 'yearly' as const },
    ...likedComponents.map((component) => ({
        path: `/liked/preview/${component.id}`,
        priority: 0.5,
        changeFrequency: 'monthly' as const,
    })),
];

export default function sitemap(): MetadataRoute.Sitemap {
    return ROUTES.flatMap((route) =>
        locales.map((locale) => ({
            url: `${baseUrl}${localizedPath(locale, route.path)}`,
            lastModified,
            changeFrequency: route.changeFrequency,
            // Varsayılan dil ana sürüm; çeviriler bir tık daha düşük öncelikli.
            priority:
                locale === defaultLocale
                    ? route.priority
                    : Math.round(route.priority * 0.9 * 10) / 10,
            // Google'a dil alternatiflerini sitemap üzerinden de bildiriyoruz;
            // sayfa içi hreflang etiketleriyle birebir aynı.
            alternates: {
                languages: Object.fromEntries(
                    locales.map((l) => [l, `${baseUrl}${localizedPath(l, route.path)}`])
                ),
            },
        }))
    );
}
