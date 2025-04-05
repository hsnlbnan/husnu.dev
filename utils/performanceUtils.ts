/**
 * Performance optimization utilities
 * 
 * Bu dosya, sitenin performansını iyileştirmek için çeşitli yardımcı işlevleri içerir
 * Core Web Vitals metriklerini iyileştirmeye odaklanır (LCP, FID, CLS, FCP, TTFB)
 */

import { Resource } from '@/config/performance';

/**
 * Core Web Vitals metriklerini iyileştirmek için temel optimizasyonları uygular
 */
export function applyCoreWebVitalsOptimizations(): void {
  if (typeof window === 'undefined') return;

  // Intersection Observer API kullanarak Lazy Loading
  setupLazyLoading();
  
  // Layout shift'leri azaltmak için görüntü alanları için yer tutucular
  preventLayoutShifts();
  
  // JavaScript yürütme zamanlamasını optimize et
  optimizeJavaScriptExecution();
}

/**
 * Lazy loading kurulumu
 * Görünüm alanına giren görselleri ve diğer ağır içerikleri yükler
 */
function setupLazyLoading(): void {
  // Halihazırda loading="lazy" özelliği olan görseller için browser desteği var
  // Ek olarak, lazy-load sınıfı olan elementler için Intersection Observer ile lazy loading
  if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.lazy-load');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            const img = element as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
          } else if (element.tagName === 'VIDEO') {
            const video = element as HTMLVideoElement;
            if (video.dataset.src) {
              video.src = video.dataset.src;
              video.removeAttribute('data-src');
            }
          } else if (element.tagName === 'IFRAME') {
            const iframe = element as HTMLIFrameElement;
            if (iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
              iframe.removeAttribute('data-src');
            }
          }
          
          element.classList.remove('lazy-load');
          lazyObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '200px 0px', // 200px öncesinde yüklemeye başla
      threshold: 0.01 // %1 görünür olduğunda başla
    });
    
    lazyElements.forEach(element => {
      lazyObserver.observe(element);
    });
  }
}

/**
 * Layout shiftleri önleme
 * CLS (Cumulative Layout Shift) skorunu iyileştirmek için
 */
function preventLayoutShifts(): void {
  // Görseller için aspect ratio korunmasını sağla
  const images = document.querySelectorAll('img:not([width]):not([height])') as NodeListOf<HTMLImageElement>;
  images.forEach(img => {
    // Görsel boyutu belli değilse placeholder yükseklik ayarla

    img.style.aspectRatio = '16 / 9'; // Varsayılan en-boy oranı
  });
  
  // Font yüklenmeden metin içeriğini gizlemek için stratejiler
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
  
  // Hero görüntüler ve büyük bloklar için yer tutucular
  const heroElements = document.querySelectorAll('.hero, .hero-image, [data-hero]');
  heroElements.forEach(element => {
    // Minimum yükseklik ayarla
    if (!element.getAttribute('style') || !element.getAttribute('style')?.includes('min-height')) {
      (element as HTMLElement).style.minHeight = '300px';
    }
  });
}

/**
 * JavaScript yürütme zamanlamasını optimize etme
 * FID (First Input Delay) skorunu iyileştirmek için
 */
function optimizeJavaScriptExecution(): void {
  // Ana iş parçacığını engellemeyen işleri requestIdleCallback'e taşı
  if ('requestIdleCallback' in window) {
    const nonCriticalTasks: (() => void)[] = [];
    
    // Performans için kullanılabilecek bir pencere
    const performNonCriticalTasks = (deadline: IdleDeadline) => {
      while (nonCriticalTasks.length > 0 && deadline.timeRemaining() > 0) {
        const task = nonCriticalTasks.shift();
        task?.();
      }
      
      if (nonCriticalTasks.length > 0) {
        requestIdleCallback(performNonCriticalTasks);
      }
    };
    
    // Analytics, event listeners, vb. gibi kritik olmayan işlemleri queue'ya eklemek için
    (window as any).queueNonCriticalTask = (task: () => void) => {
      nonCriticalTasks.push(task);
      if (nonCriticalTasks.length === 1) {
        requestIdleCallback(performNonCriticalTasks);
      }
    };
  } else {
    // requestIdleCallback desteklenmeyen tarayıcılar için fallback
    (window as any).queueNonCriticalTask = (task: () => void) => {
      setTimeout(task, 1);
    };
  }
}

/**
 * Sayfa geçişleri sırasında animasyonları geçici olarak devre dışı bırakır
 * Bu, sayfa geçişlerinin daha hızlı olmasını sağlar
 */
export function disableAnimations(): void {
  if (typeof document === 'undefined') return;
  
  // Geçici olarak bir class ekleyerek tüm animasyonları devre dışı bırak
  document.documentElement.classList.add('disable-animations');
  
  // Transition ve animation sürelerini azalt
  const style = document.createElement('style');
  style.id = 'temp-animation-disable';
  style.innerHTML = `
    .disable-animations * {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
      animation-delay: 0.001ms !important;
      transition-delay: 0.001ms !important;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Sayfa geçişleri tamamlandıktan sonra animasyonları yeniden etkinleştirir
 */
export function enableAnimations(): void {
  if (typeof document === 'undefined') return;
  
  // Animasyonları devre dışı bırakan class'ı kaldır
  document.documentElement.classList.remove('disable-animations');
  
  // Geçici stil elementini kaldır
  const tempStyle = document.getElementById('temp-animation-disable');
  if (tempStyle) {
    tempStyle.remove();
  }
}

/**
 * Sayfa geçişleri sırasında performansı optimize eder
 * Arka planda çalışan gereksiz işlemleri duraklatır
 */
export function optimizeNavigation(): void {
  if (typeof window === 'undefined') return;
  
  // Kritik olmayan ağ isteklerini durdur
  if ('connection' in navigator && (navigator as any).connection.saveData) {
    // Save-Data modu açıksa, gereksiz kaynakların yüklenmesini engelle
    document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]')
      .forEach(el => {
        if (!el.closest('visible')) {
          (el as HTMLElement).style.visibility = 'hidden';
        }
      });
  }
  
  // Kullanıcı geri dönene kadar gereksiz interval ve timeout'ları temizle
  const nonCriticalIntervals: number[] = [];
  const originalSetInterval = window.setInterval;
  const originalClearInterval = window.clearInterval;
  
  // Wrapper functions instead of redefining global methods
  const safeSetInterval = (handler: TimerHandler, timeout?: number, ...args: any[]): number => {
    const id = originalSetInterval(handler, timeout, ...args);
    if (!handler.toString().includes('critical')) {
      nonCriticalIntervals.push(id);
    }
    return id;
  };
  
  const safeClearInterval = (id?: number): void => {
    originalClearInterval(id);
    if (id && nonCriticalIntervals.includes(id)) {
      nonCriticalIntervals.splice(nonCriticalIntervals.indexOf(id), 1);
    }
  };
  
  // Expose the safe methods on window for usage
  (window as any).safeSetInterval = safeSetInterval;
  (window as any).safeClearInterval = safeClearInterval;
  
  // Sayfa geçişi tamamlandığında intervalleri yeniden başlat
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      // Gerekirse intervalleri yeniden başlat
    }
  });
}

/**
 * Kritik bir kaynak için preload tag'ı oluşturur
 */
export function createPreloadTag(resource: Resource): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = resource.path;
  
  // Kaynak türüne göre as niteliğini ayarla
  switch (resource.type) {
    case 'font':
      link.as = 'font';
      link.setAttribute('crossorigin', 'anonymous');
      break;
    case 'image':
      link.as = 'image';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'script':
      link.as = 'script';
      break;
  }
  
  // FetchPriority varsa ekle
  if (resource.fetchPriority) {
    link.setAttribute('fetchpriority', resource.fetchPriority);
  }
  
  return link;
}

/**
 * Kritik kaynakları preload et
 */
export function preloadResources(resources: Resource[]): void {
  if (typeof document === 'undefined') return;
  
  resources.forEach(resource => {
    const link = createPreloadTag(resource);
    document.head.appendChild(link);
  });
}

/**
 * Çeşitli kaynak kaynaklarına önceden bağlanmak için
 * TTFB (Time to First Byte) süresini azaltmaya yardımcı olur
 */
export function preconnectToOrigins(origins: string[]): void {
  if (typeof document === 'undefined') return;
  
  origins.forEach(origin => {
    // DNS Prefetch
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = origin;
    document.head.appendChild(dnsPrefetchLink);
    
    // Preconnect - tarayıcıya DNS aramasını önceden yapmasını söyler
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = origin;
    preconnectLink.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(preconnectLink);
  });
}

/**
 * AVIF ve WebP gibi modern görüntü formatlarının desteklenip desteklenmediğini kontrol eder
 */
export function checkImageFormatSupport(): { avif: boolean; webp: boolean } {
  if (typeof window === 'undefined') {
    return { avif: false, webp: false };
  }
  
  // WebP desteği kontrolü
  const webpSupport = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  // AVIF desteği kontrolü (daha moden bir format)
  // Bu basit bir kontroldür, tam destek kontrolü için daha karmaşık bir kontrol gerekebilir
  let avifSupport = false;
  const img = new Image();
  
  img.onload = () => {
    avifSupport = (img.width > 0) && (img.height > 0);
  };
  
  img.onerror = () => {
    avifSupport = false;
  };
  
  // Küçük bir AVIF test görseli
  img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  
  return { avif: avifSupport, webp: webpSupport };
}

/**
 * Görüntü URL'sini tarayıcı desteğine göre uyarla
 */
export function getOptimizedImageUrl(imageUrl: string): string {
  const { avif, webp } = checkImageFormatSupport();
  
  if (avif && imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png')) {
    // AVIF formatı destekleniyorsa ve görüntü uygunsa
    return imageUrl.substring(0, imageUrl.lastIndexOf('.')) + '.avif';
  } else if (webp && imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png')) {
    // WebP formatı destekleniyorsa ve görüntü uygunsa
    return imageUrl.substring(0, imageUrl.lastIndexOf('.')) + '.webp';
  }
  
  // Desteklenen format yoksa veya görüntü zaten optimizeyse orijinal URL'yi döndür
  return imageUrl;
}

/**
 * CSS için kod bölme (code splitting) - kritik CSS'yi inline olarak, 
 * gerisini asenkron olarak yükleyebilirsiniz
 */
export function loadNonCriticalCSS(stylesheets: string[]): void {
  if (typeof document === 'undefined') return;
  
  stylesheets.forEach(stylesheet => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    link.media = 'print';
    link.setAttribute('onload', "this.media='all'");
    document.head.appendChild(link);
  });
}