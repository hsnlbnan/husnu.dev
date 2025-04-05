'use client';

import { useEffect, useState, useCallback } from 'react';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

/**
 * Web Vitals metriklerini izleyen bileşen
 * - LCP (Largest Contentful Paint): İçeriğin ne kadar hızlı göründüğünü ölçer
 * - FID (First Input Delay): Etkileşime ne kadar hızlı yanıt verdiğini ölçer
 * - CLS (Cumulative Layout Shift): Görsel kararlılığı ölçer
 * - FCP (First Contentful Paint): İlk içerik gösteriminin ne kadar hızlı olduğunu ölçer
 * - TTFB (Time to First Byte): Sunucu yanıt süresini ölçer
 */
export default function PerformanceMonitor({ debug = false }: { debug?: boolean }) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [visible, setVisible] = useState(false);

  // Core Web Vitals için değerlendirme aralıkları
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  // Metriklerin değerlendirmesini hesapla (iyi, geliştirilmeli, kötü)
  const getRating = useCallback((name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }, []);

  // Metrikleri topla
  const collectMetric = useCallback((metric: any) => {
    if (metric?.name === 'TTFB') {
      // TTFB için ms cinsinden değeri al
      const value = metric.value;
      setMetrics(prev => [
        ...prev,
        {
          name: metric.name,
          value,
          rating: getRating(metric.name, value),
          delta: metric.delta,
        }
      ]);
    } else {
      setMetrics(prev => [
        ...prev,
        {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          delta: metric.delta,
        }
      ]);
    }
  }, [getRating]);

  // Toggle görünürlük
  const toggleVisibility = useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  useEffect(() => {
    // Web vitals metriklerini izlemeye başla
    if (typeof window !== 'undefined') {
      // FCPyi izleme
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            collectMetric({
              name: 'FCP',
              value: entry.startTime,
              delta: entry.startTime,
            });
          }
        }
      });
      
      observer.observe({ type: 'paint', buffered: true });
      
      // LCPyi izleme
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        collectMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
        });
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // CLSi izleme
      let clsValue = 0;
      let clsEntries: PerformanceEntry[] = [];
      
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as PerformanceEntry[];
        
        entries.forEach(entry => {
          // @ts-ignore
          if (!entry.hadRecentInput) {
            // @ts-ignore
            const firstSessionEntry = clsEntries.length === 0;
            // @ts-ignore
            const entryTime = entry.startTime;
            
            // @ts-ignore
            if (firstSessionEntry || entryTime - clsEntries[clsEntries.length - 1].startTime < 1000) {
              clsEntries.push(entry);
            } else {
              clsEntries = [entry];
            }
            
            // @ts-ignore
            let clsValueChange = 0;
            clsEntries.forEach(entry => {
              // @ts-ignore
              clsValueChange += entry.value;
            });
            
            if (clsValueChange > clsValue) {
              clsValue = clsValueChange;
              
              collectMetric({
                name: 'CLS',
                value: clsValue,
                delta: clsValue,
              });
            }
          }
        });
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // TTFB (Time to First Byte) izleme
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
        collectMetric({
          name: 'TTFB',
          value: navigationEntry.responseStart,
          delta: navigationEntry.responseStart,
        });
      }
      
      // Klavye kısayolu (debug modunda) - Ctrl+Shift+P tuş kombinasyonu
      if (debug) {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            toggleVisibility();
          }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          observer.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
        };
      }
      
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, [collectMetric, debug, toggleVisibility]);

  // Debug modunda değilse hiçbir şey gösterme
  if (!debug) return null;
  
  // Gösterge paneli kapalıysa sadece toggle butonunu göster
  if (!visible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-2 right-2 z-50 p-2 bg-gray-800 rounded-full text-xs text-white opacity-50 hover:opacity-100"
        aria-label="Show performance metrics"
      >
        Metrics
      </button>
    );
  }

  // Metrik rengini belirle
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-500';
      case 'needs-improvement':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Metrik formatını belirle
  const formatMetricValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)} ms`;
  };

  return (
    <div className="fixed bottom-2 right-2 z-50 p-3 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Core Web Vitals</h3>
        <button 
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-white"
          aria-label="Hide performance metrics"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        {metrics.length === 0 ? (
          <p className="text-gray-400">Collecting metrics...</p>
        ) : (
          metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{metric.name}:</span>
              <span className={getRatingColor(metric.rating)}>
                {formatMetricValue(metric.name, metric.value)}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}