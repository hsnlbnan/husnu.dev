/**
 * Performance configuration for the application
 *
 * This file centralizes all performance-related settings to make
 * them easier to adjust.
 */

/**
 * General performance settings
 */
export const performanceConfig = {
  /**
   * Controls whether to use the optimized page transition system
   * Set to false to disable all page transition optimizations
   */
  enableOptimizedPageTransitions: true,

  /**
   * Controls whether to disable animations during page transitions
   * for faster navigation
   */
  disableAnimationsDuringTransition: true,

  /**
   * Time in milliseconds to wait before re-enabling animations
   * after a page transition
   */
  reEnableAnimationsDelay: 50,

  /**
   * Controls whether to use lazy loading for non-critical components
   */
  useLazyLoadingForComponents: true,

  /**
   * Controls whether to use image optimization
   */
  optimizeImages: true,

  /**
   * Default quality for optimized images (1-100)
   */
  defaultImageQuality: 80,

  /**
   * Controls whether to preload critical resources
   */
  preloadCriticalResources: true,

  /**
   * List of critical resources to preload
   */
  criticalResources: [
    // Add any critical CSS, fonts, or JavaScript files here
    '/Husnu-Lubnan-CV.pdf',
  ],

  /**
   * Controls whether to use intersection observer for
   * lazy loading off-screen content
   */
  useLazyLoadingForOffScreenContent: true,

  /**
   * Root margin for intersection observer (for lazy loading)
   */
  lazyLoadingRootMargin: '200px',
};

/**
 * Critical CSS classes that should always be included in the initial CSS
 * to prevent layout shifts during loading
 */
export const criticalCssClasses = [
  'container',
  'flex',
  'items-center',
  'justify-between',
  'p-4',
];

/**
 * Components that should be preloaded at startup
 * (not lazily loaded) because they are critical for
 * initial UI rendering
 */
export const preloadComponents = [
  'Header',
  'Footer',
];

/**
 * Settings for Third-Party Script Loading
 */
export const scriptLoadingStrategy = {
  /**
   * Controls how analytics scripts are loaded
   * Options: 'eager', 'lazy', 'afterInteraction'
   */
  analytics: 'lazy',

  /**
   * Controls how third-party widgets are loaded
   * Options: 'eager', 'lazy', 'afterInteraction'
   */
  widgets: 'afterInteraction',

  /**
   * Controls how font loading is optimized
   * Options: 'swap', 'block', 'fallback', 'optional'
   */
  fontDisplay: 'swap',
};

/**
 * Default timeout values
 */
export const timeouts = {
  /**
   * Time in milliseconds after which a loading indicator is shown
   * if the page is still loading
   */
  showLoadingIndicator: 300,

  /**
   * Time in milliseconds before considering a network request as "slow"
   * and showing a loading indicator
   */
  networkRequestTimeout: 5000,
};

/**
 * Get critical resources based on the current pathname
 * @param pathname Current URL pathname
 * @returns Array of resources that should be preloaded for this page
 */
export const getCriticalResourcesForPath = (pathname: string): string[] => {
  // Base resources that should be loaded for all pages
  const baseResources = performanceConfig.criticalResources;

  // Page-specific resources
  const pageResources: Record<string, string[]> = {
    '/': [
      // Critical resources for the home page
    ],
    '/liked': [
      // Critical resources for the liked page
    ],
  };

  // Return combined resources
  return [...baseResources, ...(pageResources[pathname] || [])];
};

export default performanceConfig;