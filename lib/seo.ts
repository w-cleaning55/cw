import { COMPANY_INFO } from "./constants";
import type { SEOConfig } from "./types";

// Generate structured data for cleaning service
export function generateCleaningServiceStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://m-clean.net/#organization",
    name: COMPANY_INFO.fullName,
    description: COMPANY_INFO.description,
    url: "https://m-clean.net",
    logo: "https://m-clean.net/logo.svg",
    image: "https://m-clean.net/hero-banner.svg",
    telephone: COMPANY_INFO.contact.phones[0],
    email: COMPANY_INFO.contact.emails[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY_INFO.location.city,
      addressCountry: COMPANY_INFO.location.country,
      streetAddress: COMPANY_INFO.location.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "21.4858",
      longitude: "39.1925",
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    serviceArea: {
      "@type": "City",
      name: "جدة",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات التنظيف",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "تنظيف المنازل والفلل",
            description: "خدمة تنظيف شاملة للمنازل والفلل مع ضمان الجودة",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "تنظيف المكاتب والشركات",
            description: "حلول تنظيف احترافية للمكاتب والمباني التجارية",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "تنظيف السجاد والستائر",
            description: "خدمة تنظيف وتعقيم السجاد والستائر بأحدث التقنيات",
          },
        },
      ],
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
          text: "نقدم خدمات تنظيف شاملة تشمل تنظيف المنازل والفلل، تنظيف المكاتب والشركات، تنظيف السجاد والستائر، جلي وتلميع الرخام، تنظيف خزانات المياه، ومكافحة الحشرات.",
        },
      },
      {
        "@type": "Question",
        name: "هل تقدمون ضمان على خدماتكم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، نقدم ضمان 100% على جميع خدماتنا مع إمكانية الإعادة في حالة عدم الرضا التام عن الخدمة.",
        },
      },
      {
        "@type": "Question",
        name: "كم تستغرق عملية التنظيف؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "يعتمد وقت التنظيف على نوع الخدمة وحجم المكان. فريقنا المحترف ينجز المهام في الوقت المحدد بأعلى معايير الجودة.",
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
      item: `https://m-clean.net${index === 0 ? "" : `/${item.toLowerCase()}`}`,
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
    "خدمات تن��يف",
    "شركة تنظيف",
  ],
  openGraph: {
    title: COMPANY_INFO.fullName,
    description: COMPANY_INFO.tagline,
    image: "https://m-clean.net/hero-banner.svg",
    url: "https://m-clean.net",
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
  const baseUrl = "https://m-clean.net";
  return `${baseUrl}${pathname === "/" ? "" : pathname}`;
}

// Sitemap generation helper
export function generateSitemapEntry(
  url: string,
  lastModified: Date = new Date(),
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "weekly",
  priority: number = 0.5
) {
  return {
    url: `https://m-clean.net${url}`,
    lastModified: lastModified.toISOString().split("T")[0],
    changeFrequency,
    priority,
  };
}
