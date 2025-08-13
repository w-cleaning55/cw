// Centralized Constants and Configuration
export const APP_CONFIG = {
  name: "Cleaning World",
  nameAr: "عالم النظافة جدة",
  domain: "https://m-clean.net",
  defaultLanguage: "ar",
  supportedLanguages: ["ar", "en"],
  currency: "SAR",
  currencySymbol: "ريال",
  phone: "+966 50 123 4567",
  email: "info@m-clean.net",
  address: "الرياض، المملكة العربية السعودية",
  addressEn: "Riyadh, Saudi Arabia",
} as const;

export const API_ENDPOINTS = {
  services: "/api/admin/services",
  bookings: "/api/admin/bookings",
  customers: "/api/admin/customers",
  companySettings: "/api/admin/company-settings",
  siteContent: "/api/admin/site-content",
  analytics: "/api/admin/analytics",
  messages: "/api/admin/messages",
  notifications: "/api/admin/notifications",
  auth: {
    login: "/api/auth/login",
    verify: "/api/auth/verify",
    logout: "/api/auth/logout",
  },
} as const;

export const DEFAULT_RESPONSES = {
  services: [],
  bookings: [],
  customers: [],
  notifications: [],
  messages: [],
  analytics: {
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    completedServices: 0,
  },
} as const;

export const VALIDATION_RULES = {
  phone: /^(\+966|0)?[5-9][0-9]{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  required: (value: any) =>
    value !== null && value !== undefined && value !== "",
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
} as const;

export const UI_CONSTANTS = {
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  colors: {
    primary: "hsl(221, 83%, 53%)",
    secondary: "hsl(210, 40%, 98%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    error: "hsl(0, 84%, 60%)",
    info: "hsl(199, 89%, 48%)",
  },
  animations: {
    fadeIn: "fade-in 0.5s ease-out",
    slideUp: "slide-up 0.3s ease-out",
    bounce: "bounce 2s infinite",
  },
} as const;

export const SEO_CONFIG = {
  titleTemplate: "%s | Cleaning World",
  defaultTitle: "Cleaning World - خدمات التنظيف المهنية",
  description:
    "Professional cleaning services in Saudi Arabia with advanced equipment and experienced technicians",
  descriptionAr:
    "خدمات التنظيف المهنية في المملكة العربية السعودية بمعدات متطورة وفنيين ذوي خبرة",
  keywords: [
    "cleaning",
    "تنظيف",
    "خدمات",
    "professional services",
    "Saudi Arabia",
    "المملكة العربية السعودية",
  ] as string[],
  openGraph: {
    type: "website" as const,
    locale: "ar_SA",
    url: "https://m-clean.net",
    siteName: "Cleaning World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cleaning World - Professional Cleaning Services",
      },
    ] as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>,
  },
  twitter: {
    card: "summary_large_image",
    site: "@cleaningworld",
    creator: "@cleaningworld",
  },
} as const;
