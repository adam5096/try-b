export default defineNuxtPlugin(() => {
  if (!process.client) return;

  const config = useRuntimeConfig();
  
  // 檢查是否啟用 Web Vitals 監控
  if (!config.public.enableWebVitals) {
    return;
  }

  // 簡單的 Web Vitals 監控實現
  const reportWebVitals = (metric: any) => {
    console.log('Web Vital:', metric);
    
    // 可以在這裡發送資料到分析服務
    // 例如：Google Analytics, Mixpanel, 或自建的監控系統
    
    // 範例：發送到 Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  // 監控 Core Web Vitals
  const observeWebVitals = () => {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          reportWebVitals({
            name: 'LCP',
            value: lastEntry.startTime,
            id: lastEntry.id,
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            reportWebVitals({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: entry.id,
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          // 只在頁面卸載時報告 CLS
          if (document.visibilityState === 'hidden') {
            reportWebVitals({
              name: 'CLS',
              value: clsValue,
              id: 'cls-final',
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
  };

  // 監控頁面載入時間
  const observePageLoad = () => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          reportWebVitals({
            name: 'TTFB',
            value: navigation.responseStart - navigation.requestStart,
            id: 'ttfb',
          });
          
          reportWebVitals({
            name: 'DOM_LOAD',
            value: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            id: 'dom-load',
          });
          
          reportWebVitals({
            name: 'PAGE_LOAD',
            value: navigation.loadEventEnd - navigation.navigationStart,
            id: 'page-load',
          });
        }
      }, 0);
    });
  };

  // 初始化監控
  observeWebVitals();
  observePageLoad();
});
