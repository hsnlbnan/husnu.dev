'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { disableAnimations, enableAnimations, optimizeNavigation } from '@/utils/performanceUtils';

/**
 * Custom hook for optimizing page transitions in Next.js
 *
 * This hook handles navigation events and applies performance
 * optimizations to make page transitions as fast as possible.
 */
const usePageTransition = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Triggered when navigating away from the current page
  const handleBeforeNavigation = useCallback(() => {
    // Disable all animations temporarily for faster transitions
    disableAnimations();

    // Clean up any resources, timers, etc.
    optimizeNavigation();

    // You could also prefetch resources here if you know what the next page needs
  }, []);

  // Triggered when a new page has loaded
  const handleAfterNavigation = useCallback(() => {
    // Re-enable animations after a short delay
    setTimeout(() => {
      enableAnimations();
    }, 1);
  }, []);

  // Listen for route changes
  useEffect(() => {
    // Handle completion of navigation
    handleAfterNavigation();

    return () => {
      // Handle start of navigation
      handleBeforeNavigation();
    };
  }, [pathname, handleBeforeNavigation, handleAfterNavigation]);

  /**
   * Programmatic navigation with performance optimizations
   * Use this instead of router.push for optimal performance
   */
  const navigateTo = useCallback((url: string) => {
    handleBeforeNavigation();
    router.push(url);
  }, [router, handleBeforeNavigation]);

  return { navigateTo };
};

export default usePageTransition;