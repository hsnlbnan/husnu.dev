/**
 * Performance konfigürasyon dosyası
 * Bu dosya, belirli sayfalar için kritik kaynakları tanımlar
 */

// Resource tipi ve özellikleri
export type ResourceType = 'font' | 'image' | 'style' | 'script' | 'prefetch';

export interface Resource {
  path: string;
  type: ResourceType;
  fetchPriority?: 'high' | 'low' | 'auto';
  loadingStrategy?: 'eager' | 'lazy';
  mediaType?: string; // font/woff2, image/webp gibi
  viewport?: 'mobile' | 'desktop' | 'all'; // Hangi viewport'da yüklenecek
  condition?: 'light' | 'dark' | 'reduced-motion' | 'all'; // Hangi koşulda yüklenecek
}

interface PageResources {
  [key: string]: Resource[];
}

/**
 * Her sayfa için kritik kaynaklar
 * 
 * Not: Sayfaların optimum performansı için kritik kaynaklar
 * - fonts: İlk ekranda görünen yazı tipleri
 * - images: Hero görüntüleri, logo, kritik görseller
 * - styles: Sayfa stillerinin çekirdek kısmı
 * - scripts: Sayfa yüklenmesi için gereken kritik JS
 */
export const criticalResources: PageResources = {
  '/': [
    // Ana sayfa için kritik kaynaklar (LCP elementleri)
    { 
      path: '/me.webp', 
      type: 'image',
      fetchPriority: 'high',
      loadingStrategy: 'eager',
      mediaType: 'image/webp',
      viewport: 'all'
    },
    { 
      path: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', 
      type: 'style',
      fetchPriority: 'high',
      viewport: 'all'
    },
    { 
      path: '/logos/shftco.jpeg', 
      type: 'image',
      loadingStrategy: 'lazy',
      viewport: 'desktop'
    },
    // Sonraki sayfalar için prefetch
    {
      path: '/liked',
      type: 'prefetch',
      fetchPriority: 'low'
    }
  ],
  '/liked': [
    // Liked sayfası için kritik kaynaklar
    { 
      path: '/og-liked.png', 
      type: 'image',
      fetchPriority: 'high',
      loadingStrategy: 'eager' 
    },
    { 
      path: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', 
      type: 'style',
      fetchPriority: 'high'
    }
  ],
  // Diğer sayfalar için kritik kaynaklar eklenebilir
};

/**
 * Önyükleme (preloading) stratejileri
 */
export const preloadingStrategies = {
  // Kullanıcı eylem durumları için preloading stratejileri
  hover: {
    delay: 200, // hover'dan sonra preload başlaması için ms cinsinden gecikme
    threshold: 300 // hover'ın ne kadar sürmesi gerektiği
  },
  prefetch: {
    // Görüntü alanına giren linkler için prefetch
    viewportThreshold: 0.1, // Görüntü alanının %10'unda göründüğünde
    delay: 500, // ms cinsinden gecikme
  },
  idle: {
    // Boşta kalma durumunda preload
    timeout: 2000 // sayfa yüklendikten sonra beklenecek süre
  }
};

/**
 * Belirli bir sayfa için kritik kaynakları çeker
 * @param path Sayfa yolu
 * @param viewport İsteğe bağlı viewport (mobile, desktop)
 */
export function getCriticalResourcesForPath(path: string, viewport?: 'mobile' | 'desktop'): Resource[] {
  const resources = criticalResources[path] || [];
  
  if (!viewport) {
    return resources;
  }
  
  // Viewport'a göre filtreleme
  return resources.filter(resource => {
    return !resource.viewport || resource.viewport === 'all' || resource.viewport === viewport;
  });
}

/**
 * Kaynak türüne göre önden yükleme stratejisini belirler
 */
export function getPreloadStrategyForResource(resource: Resource): string {
  switch (resource.type) {
    case 'font':
      return 'font';
    case 'image':
      return 'image';
    case 'style':
      return 'style';
    case 'script':
      return 'script';
    case 'prefetch':
      return 'document';
    default:
      return '';
  }
}

/**
 * Sayfada kullanılan viewport'u tespit eder
 */
export function detectViewport(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop'; // Server-side rendering durumunda varsayılan
  }
  
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

/**
 * Optimize edilmiş yükleme yöntemini belirler
 */
export function getOptimizedLoadingMethod(resource: Resource): 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch' {
  // Yüksek öncelikli kaynaklar için preload
  if (resource.fetchPriority === 'high') {
    return 'preload';
  }
  
  // İçerik tipine göre stratejiler
  switch (resource.type) {
    case 'font':
      return 'preload'; // Fontlar kritik olduğu için preload edilmeli
    case 'prefetch':
      return 'prefetch'; // Sonraki sayfa navigasyonları için prefetch
    case 'image':
      // Lazy loading stratejisine göre
      return resource.loadingStrategy === 'eager' ? 'preload' : 'prefetch';
    case 'style':
      return 'preload';
    case 'script':
      return 'prefetch'; // Scriptler genelde kritik olmadığı için prefetch
    default:
      return 'prefetch';
  }
}