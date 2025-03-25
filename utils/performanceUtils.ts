/**
 * Performance utilities for optimizing page transitions and first paint
 */

/**
 * Preloads critical resources to improve page load performance
 * @param urls Array of URLs to preload
 */
export const preloadResources = (urls: string[]) => {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';

    // Determine resource type based on file extension
    if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(url)) {
      link.as = 'image';
    } else if (/\.(woff|woff2|ttf|otf)$/i.test(url)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }

    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Loads all images within a container
 * @param container The container element to look for images in
 */
export const preloadImagesInContainer = (container: HTMLElement) => {
  if (typeof window === 'undefined') return;

  const images = container.querySelectorAll('img[data-src]');
  images.forEach(img => {
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
      img.setAttribute('src', dataSrc);
    }
  });
};

/**
 * Disables animations temporarily for faster navigation
 * Call this before navigation and then enableAnimations afterward
 */
export const disableAnimations = () => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'disable-animations';
  style.innerHTML = '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }';
  document.head.appendChild(style);
};

/**
 * Re-enables animations after navigation
 */
export const enableAnimations = () => {
  if (typeof window === 'undefined') return;

  const style = document.getElementById('disable-animations');
  if (style) {
    document.head.removeChild(style);
  }
};

/**
 * Optimizes navigation between pages by performing cleanup
 * and preparation tasks
 */
export const optimizeNavigation = () => {
  if (typeof window === 'undefined') return;

  // Stop any ongoing animations or timers
  const id = requestAnimationFrame(() => {});
  cancelAnimationFrame(id);

  // Clear any ongoing timeouts
  const highestId = window.setTimeout(() => {}, 0);
  for (let i = 0; i < highestId; i++) {
    window.clearTimeout(i);
  }

  // Clear any cached data that's no longer needed
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.startsWith('dynamic-')) {
          caches.delete(cacheName);
        }
      });
    });
  }

  // Disable animations temporarily for faster navigation
  disableAnimations();

  // Re-enable animations after a short delay
  setTimeout(() => {
    enableAnimations();
  }, 100);
};