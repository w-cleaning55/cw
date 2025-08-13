import { Metadata } from 'next';

// Company information for SEO
const COMPANY_INFO = {
  name: 'عالم النظافة جدة',
  nameEn: 'Cleaning World Jeddah',
  description: 'شركة تنظيف احترافية في جدة تستخدم أحدث المعدات الأمريكية والأوروبية مع أكثر من 6 سنوات من الخبرة في السوق السعودي',
  descriptionEn: 'Professional cleaning company in Jeddah using the latest American and European equipment with over 6 years of experience in the Saudi market',
  url: 'https://cleaningworld-jeddah.com',
  phone: '+966126543210',
  email: 'info@cleaningworld-jeddah.com',
  address: 'شارع الأمير سلطان، حي الزهراء، جدة، المملكة العربية السعودية',
  addressEn: 'Prince Sultan Street, Al-Zahra District, Jeddah, Saudi Arabia',
  logo: 'https://cleaningworld-jeddah.com/images/company/logo.png',
  image: 'https://cleaningworld-jeddah.com/images/company/og-image.jpg',
  latitude: 21.5433,
  longitude: 39.1728,
  foundedYear: 2018,
  employees: 50,
  rating: 4.9,
  reviewCount: 127
};

// Default SEO configuration
export const defaultSEOConfig: Metadata = {
  title: {
    template: '%s | عالم النظافة جدة',
    default: 'عالم النظافة جدة - شركة تنظيف احترافية | خدمات تنظيف شاملة'
  },
  description: COMPANY_INFO.description,
  keywords: [
    'شركة تنظيف جدة',
    'تنظيف منازل جدة',
    'جلي رخام جدة',
    'تنظيف سجاد جدة',
    'تعقيم منازل جدة',
    'مكافحة حشرات جدة',
    'تنظيف مكاتب جدة',
    'شركة نظافة جدة',
    'خدمات تنظيف جدة',
    'تنظيف فلل جدة'
  ],
  authors: [{ name: 'عالم النظافة جدة' }],
  creator: 'عالم النظافة جدة',
  publisher: 'عالم النظافة جدة',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(COMPANY_INFO.url),
  alternates: {
    canonical: COMPANY_INFO.url,
    languages: {
      'ar-SA': '/',
      'en-SA': '/en'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_SA',
    url: COMPANY_INFO.url,
    siteName: COMPANY_INFO.name,
    title: 'عالم النظافة جدة - شركة تنظيف احترافية',
    description: COMPANY_INFO.description,
    images: [
      {
        url: COMPANY_INFO.image,
        width: 1200,
        height: 630,
        alt: 'عالم النظافة جدة - خدمات تنظيف احترافية'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cleanworld_jed',
    creator: '@cleanworld_jed',
    title: 'عالم النظافة جدة - شركة تنظيف احترافية',
    description: COMPANY_INFO.description,
    images: [COMPANY_INFO.image]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
    }
  }
};

// Generate Local Business Schema
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${COMPANY_INFO.url}/#business`,
    name: COMPANY_INFO.name,
    alternateName: COMPANY_INFO.nameEn,
    description: COMPANY_INFO.description,
    url: COMPANY_INFO.url,
    logo: COMPANY_INFO.logo,
    image: [
      COMPANY_INFO.image,
      'https://cleaningworld-jeddah.com/images/gallery/team-work-1.jpg',
      'https://cleaningworld-jeddah.com/images/gallery/equipment-1.jpg'
    ],
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'شارع الأمير سلطان، حي الزهراء',
      addressLocality: 'جدة',
      addressRegion: 'منطقة مكة المكرمة',
      postalCode: '21589',
      addressCountry: 'SA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.latitude,
      longitude: COMPANY_INFO.longitude
    },
    areaServed: {
      '@type': 'City',
      name: 'جدة',
      alternateName: 'Jeddah'
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: COMPANY_INFO.latitude,
        longitude: COMPANY_INFO.longitude
      },
      geoRadius: '50000'
    },
    openingHours: [
      'Sa-Th 07:00-22:00',
      'Fr 14:00-22:00'
    ],
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Mada'],
    currenciesAccepted: 'SAR',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: COMPANY_INFO.rating,
      reviewCount: COMPANY_INFO.reviewCount,
      bestRating: '5',
      worstRating: '1'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات التنظيف',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تنظيف وتعقيم السجاد والستائر',
            description: 'تنظيف عميق للسجاد والستائر باستخدام أحدث المعدات'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تنظيف وتعقيم المجالس والكنب',
            description: 'تنظيف متخصص للمجالس والكنب مع معالجة جميع أنواع الأقمشة'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'جلي الرخام والأرضيات',
            description: 'جلي وتلميع الرخام والأرضيات بأحدث تقنيات الماس'
          }
        }
      ]
    },
    founder: {
      '@type': 'Person',
      name: 'خالد جمال',
      jobTitle: 'المؤسس والمدير العام'
    },
    numberOfEmployees: COMPANY_INFO.employees,
    foundingDate: COMPANY_INFO.foundedYear.toString(),
    slogan: 'نظافة.. جودة.. ثقة',
    keywords: 'تنظيف جدة, شركة تنظيف, جلي رخام, تنظيف سجاد, تعقيم منازل',
    sameAs: [
      'https://facebook.com/CleaningWorldJeddah',
      'https://twitter.com/cleanworld_jed',
      'https://instagram.com/cleaningworld.jeddah',
      'https://linkedin.com/company/cleaning-world-jeddah'
    ]
  };
};

// Generate Organization Schema
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${COMPANY_INFO.url}/#organization`,
    name: COMPANY_INFO.name,
    alternateName: COMPANY_INFO.nameEn,
    url: COMPANY_INFO.url,
    logo: COMPANY_INFO.logo,
    description: COMPANY_INFO.description,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'شارع الأمير سلطان، حي الزهراء',
      addressLocality: 'جدة',
      addressRegion: 'منطقة مكة المكرمة',
      postalCode: '21589',
      addressCountry: 'SA'
    },
    foundingDate: COMPANY_INFO.foundedYear.toString(),
    numberOfEmployees: COMPANY_INFO.employees,
    sameAs: [
      'https://facebook.com/CleaningWorldJeddah',
      'https://twitter.com/cleanworld_jed',
      'https://instagram.com/cleaningworld.jeddah',
      'https://linkedin.com/company/cleaning-world-jeddah'
    ]
  };
};

// Generate FAQ Schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Generate Service Schema
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  price?: string;
  duration?: string;
  serviceType?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: COMPANY_INFO.name,
      telephone: COMPANY_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'جدة',
        addressCountry: 'SA'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'جدة'
    },
    ...(service.serviceType && { serviceType: service.serviceType }),
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'SAR'
      }
    })
  };
};

// Generate Review Schema
export const generateReviewSchema = (reviews: Array<{
  author: string;
  rating: number;
  text: string;
  date: string;
}>) => {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: COMPANY_INFO.name
    },
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
      worstRating: '1'
    },
    reviewBody: review.text,
    datePublished: review.date
  }));
};

// Generate BreadcrumbList Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

// Generate complete structured data for a page
export const generatePageSchema = (pageType: string, pageData?: any) => {
  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema()
  ];

  switch (pageType) {
    case 'home':
      // Add additional schemas for home page
      break;
    case 'service':
      if (pageData?.service) {
        schemas.push(generateServiceSchema(pageData.service));
      }
      break;
    case 'faq':
      if (pageData?.faqs) {
        schemas.push(generateFAQSchema(pageData.faqs));
      }
      break;
    case 'reviews':
      if (pageData?.reviews) {
        schemas.push(...generateReviewSchema(pageData.reviews));
      }
      break;
  }

  if (pageData?.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(pageData.breadcrumbs));
  }

  return schemas;
};

// SEO keywords for different pages
export const SEO_KEYWORDS = {
  home: [
    'شركة تنظيف جدة',
    'تنظيف منازل جدة',
    'عالم النظافة',
    'خدمات تنظيف احترافية',
    'تنظيف فلل جدة'
  ],
  services: [
    'خدمات تنظيف',
    'تنظيف سجاد',
    'جلي رخام',
    'تعقيم منازل',
    'مكافحة حشرات'
  ],
  about: [
    'شركة نظافة جدة',
    'تنظيف احترافي',
    'خبرة تنظيف',
    'فريق تنظيف'
  ],
  contact: [
    'تواصل شركة تنظيف',
    'رقم شركة نظافة جدة',
    'عنوان شركة تنظيف'
  ]
};

export default {
  COMPANY_INFO,
  defaultSEOConfig,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
  generatePageSchema,
  SEO_KEYWORDS
};
