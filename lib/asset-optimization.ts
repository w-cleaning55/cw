/**
 * Asset optimization utilities for improved performance
 */

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  // Add to head if not already present
  if (!document.querySelector(`link[href="${href}"]`)) {
    document.head.appendChild(link);
  }
}

// Prefetch resources for next navigation
export function prefetchResource(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  if (!document.querySelector(`link[href="${href}"]`)) {
    document.head.appendChild(link);
  }
}

// Optimize font loading
export function preloadFonts(fonts: Array<{ href: string; crossOrigin?: boolean }>) {
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.href;
    link.as = 'font';
    link.type = 'font/woff2';
    if (font.crossOrigin) link.crossOrigin = 'anonymous';
    
    if (!document.querySelector(`link[href="${font.href}"]`)) {
      document.head.appendChild(link);
    }
  });
}

// Critical CSS inlining
export function inlineCriticalCSS(css: string) {
  if (typeof window === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

// Lazy load non-critical CSS
export function loadNonCriticalCSS(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  
  document.head.appendChild(link);
}

// Resource hints for external domains
export function addResourceHints(domains: string[]) {
  if (typeof window === 'undefined') return;
  
  domains.forEach(domain => {
    // DNS prefetch
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = `//${domain}`;
    
    // Preconnect for critical domains
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = `https://${domain}`;
    preconnect.crossOrigin = 'anonymous';
    
    if (!document.querySelector(`link[href="//${domain}"]`)) {
      document.head.appendChild(dnsPrefetch);
    }
    
    if (!document.querySelector(`link[href="https://${domain}"]`)) {
      document.head.appendChild(preconnect);
    }
  });
}

// Image optimization helpers
export function getOptimizedImageUrl(
  src: string,
  { width, height, quality = 85, format = 'webp' }: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
) {
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
}

// Generate responsive image srcset
export function generateSrcSet(
  src: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536]
) {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, { width: size })} ${size}w`)
    .join(', ');
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined') return null;
  
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}

// Performance monitoring for assets
export function measureAssetLoadTime(assetUrl: string) {
  if (typeof window === 'undefined' || !('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name.includes(assetUrl)) {
        console.log(`Asset ${assetUrl} loaded in ${entry.duration}ms`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

// Service Worker registration for caching
export async function registerServiceWorker(swPath = '/sw.js') {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Critical resources that should be preloaded
export const CRITICAL_RESOURCES = {
  fonts: [
    { href: '/fonts/inter-var.woff2', crossOrigin: true },
    { href: '/fonts/tajawal-var.woff2', crossOrigin: true },
  ],
  css: [
    '/styles/critical.css',
  ],
  images: [
    '/images/hero-banner.svg',
    '/images/logo.svg',
  ],
  domains: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ],
};

// Initialize performance optimizations
export function initializeAssetOptimizations() {
  if (typeof window === 'undefined') return;
  
  // Preload critical fonts
  preloadFonts(CRITICAL_RESOURCES.fonts);
  
  // Add resource hints for external domains
  addResourceHints(CRITICAL_RESOURCES.domains);
  
  // Preload critical images
  CRITICAL_RESOURCES.images.forEach(src => {
    preloadResource(src, 'image');
  });
  
  // Register service worker
  registerServiceWorker();
}

export default {
  preloadResource,
  prefetchResource,
  preloadFonts,
  inlineCriticalCSS,
  loadNonCriticalCSS,
  addResourceHints,
  getOptimizedImageUrl,
  generateSrcSet,
  createIntersectionObserver,
  measureAssetLoadTime,
  registerServiceWorker,
  initializeAssetOptimizations,
};
