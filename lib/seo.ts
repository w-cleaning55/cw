import { COMPANY_INFO, APP_CONFIG, BUSINESS_SCHEMA } from "./constants";
import type { SEOConfig } from "./types";

// Generate structured data for cleaning service
export function generateCleaningServiceStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: APP_CONFIG.nameEn,
    alternateName: COMPANY_INFO.name,
    image: BUSINESS_SCHEMA.images,
    email: APP_CONFIG.email,
    telephone: APP_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.location.streetAddress,
      addressLocality: COMPANY_INFO.location.city,
      postalCode: COMPANY_INFO.location.postalCode,
      addressCountry: COMPANY_INFO.location.countryCode,
    },
    url: APP_CONFIG.domain,
    description: COMPANY_INFO.description,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: BUSINESS_SCHEMA.openingHours.dayOfWeek,
        opens: BUSINESS_SCHEMA.openingHours.opens,
        closes: BUSINESS_SCHEMA.openingHours.closes,
      },
    ],
    serviceArea: { "@type": "Place", name: BUSINESS_SCHEMA.serviceAreaName },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS_SCHEMA.aggregateRating.ratingValue,
      reviewCount: BUSINESS_SCHEMA.aggregateRating.reviewCount,
    },
    sameAs: BUSINESS_SCHEMA.sameAs,
    priceRange: BUSINESS_SCHEMA.priceRange,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات التنظيف",
      itemListElement: BUSINESS_SCHEMA.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هي أنواع الخدمات التي تقدمونها؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "نقدم خدمات تنظيف شاملة تشمل تنظيف وتعقيم الستائر والسجاد، المجالس والكنب، الأرضيات، خزانات المياه، المطاعم، مكافحة الحشرات.",
        },
      },
    ],
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(path: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: path.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
      item: `${APP_CONFIG.domain}${index === 0 ? "" : `/${item.toLowerCase()}`}`,
    })),
  };
}

// Default SEO configuration
export const DEFAULT_SEO: SEOConfig = {
  title: `${COMPANY_INFO.fullName} - ${COMPANY_INFO.tagline}`,
  description: COMPANY_INFO.description,
  keywords: [
    "تنظيف",
    "تنظيف منازل",
    "تنظيف مكاتب",
    "تنظيف سجاد",
    "جلي رخام",
    "مكافحة حشرات",
    "جدة",
    "السعودية",
    "خدمات تنظيف",
    "شركة تنظيف",
  ],
  openGraph: {
    title: COMPANY_INFO.fullName,
    description: COMPANY_INFO.tagline,
    image: `${APP_CONFIG.domain}/images/hero.jpg`,
    url: APP_CONFIG.domain,
  },
  twitter: {
    card: "summary_large_image",
    site: "@cleaningworld",
    creator: "@cleaningworld",
  },
};

// Generate page-specific SEO
export function generatePageSEO(
  pageName: string,
  description?: string,
  keywords?: string[]
): SEOConfig {
  return {
    ...DEFAULT_SEO,
    title: `${pageName} | ${COMPANY_INFO.name}`,
    description: description || DEFAULT_SEO.description,
    keywords: keywords ? [...DEFAULT_SEO.keywords, ...keywords] : DEFAULT_SEO.keywords,
    openGraph: {
      ...DEFAULT_SEO.openGraph!,
      title: `${pageName} | ${COMPANY_INFO.name}`,
      description: description || DEFAULT_SEO.description,
    },
  };
}

// Meta tags generator
export function generateMetaTags(seo: SEOConfig) {
  return [
    { name: "description", content: seo.description },
    { name: "keywords", content: seo.keywords.join(", ") },
    { name: "author", content: COMPANY_INFO.name },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:title", content: seo.openGraph?.title || seo.title },
    { property: "og:description", content: seo.openGraph?.description || seo.description },
    { property: "og:image", content: seo.openGraph?.image },
    { property: "og:url", content: seo.openGraph?.url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ar_SA" },
    { name: "twitter:card", content: seo.twitter?.card },
    { name: "twitter:site", content: seo.twitter?.site },
    { name: "twitter:creator", content: seo.twitter?.creator },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: seo.openGraph?.image },
  ].filter((tag) => tag.content);
}

// Canonical URL generator
export function generateCanonicalUrl(pathname: string): string {
  const baseUrl = APP_CONFIG.domain;
  return `${baseUrl}${pathname === "/" ? "" : pathname}`;
}

// Sitemap generation helper
export function generateSitemapEntry(
  url: string,
  lastModified: Date = new Date(),
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never" = "weekly",
  priority: number = 0.5
) {
  return {
    url: `${APP_CONFIG.domain}${url}`,
    lastModified: lastModified.toISOString().split("T")[0],
    changeFrequency,
    priority,
  };
}
