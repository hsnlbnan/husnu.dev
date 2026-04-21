import { MetadataRoute } from 'next';
import { likedComponents } from '@/data/likedComponents';

const baseUrl = 'https://husnu.dev';
const lastModified = new Date('2026-04-21');

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        { path: '', priority: 1 },
        { path: '/liked', priority: 0.8 },
        { path: '/ses', priority: 0.6 },
    ].map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: route.priority,
    }));

    const previewRoutes = likedComponents.map((component) => ({
        url: `${baseUrl}/liked/preview/${component.id}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...staticRoutes, ...previewRoutes];
}
