// Application Configuration
export const APP_CONFIG = {
  name: "عالم النظافة",
  nameAr: "عالم النظافة",
  nameEn: "CLEANING WORLD",
  domain: "https://www.cw.com.sa",
  phone: "+966559061065",
  email: "admin@cw.com.sa",
  version: "1.0.0",
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  defaultTitle: "عالم النظافة - شريككم الموثوق لخدمات التنظيف المحترفة",
  description:
    "شركة خدمات تنظيف محترفة في جدة متخصصة في تنظيف وتعقيم الستائر والسجاد، المجالس والكنب، الأرضيات، خزانات المياه، المطاعم، مكافحة الحشرات.",
  keywords: [
    "تنظيف",
    "تنظيف منازل",
    "تنظيف مكاتب",
    "جدة",
    "السعودية",
    "خدمات تنظيف",
    "شركة تنظيف",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://www.cw.com.sa",
    siteName: "عالم النظافة",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cleaningworld",
    creator: "@cleaningworld",
  },
} as const;

// Company Information
export const COMPANY_INFO = {
  name: "عالم النظافة",
  fullName: "عالم النظافة",
  tagline: "شريككم الموثوق لخدمات التنظيف المحترفة في جدة",
  description:
    "شركة خدمات تنظيف محترفة في جدة متخصصة في تنظيف وتعقيم الستائر والسجاد، المجالس والكنب، الأرضيات، خزانات المياه، المطاعم، مكافحة الحشرات.",
  foundedYear: 2018,
  location: {
    streetAddress: "حي البشائر، شارع أبي فراس الحمداني",
    city: "جدة",
    postalCode: "23762",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
  },
  contact: {
    phones: ["+966559061065"],
    emails: ["admin@cw.com.sa"],
  },
} as const;

// Centralized structured data extras
export const BUSINESS_SCHEMA = {
  images: [
    "https://www.cw.com.sa/images/cleaning1.jpg",
    "https://www.cw.com.sa/images/cleaning2.jpg",
  ],
  sameAs: [
    "https://www.snapchat.com/@c_world0",
    "https://www.instagram.com/c.world.sa/?hl=",
    "https://x.com/C_world0",
  ],
  openingHours: {
    dayOfWeek: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],
    opens: "08:00",
    closes: "17:00",
  },
  serviceAreaName: "جدة",
  aggregateRating: { ratingValue: "4.9", reviewCount: "120" },
  priceRange: "$$$",
  services: [
    "تنظيف وتعقيم الستائر والسجاد",
    "تنظيف وتعقيم المجالس والكنب",
    "تنظيف وتلميع الأرضيات وجلي الرخام",
    "تنظيف وعزل خزانات المياه والمسابح",
    "تنظيف الكافيهات والمطاعم والمنشآت التجارية",
    "مكافحة الحشرات والقوارض",
  ],
} as const;

// Company Statistics
export const COMPANY_STATS = {
  experience: "6+",
  experienceLabel: "سنوات الخبرة",
  projects: "2850+",
  projectsLabel: "مشروع مكتمل",
  employees: "50+",
  employeesLabel: "موظف متخصص",
  satisfaction: "98.5%",
  satisfactionLabel: "رضا العملاء",
  rating: "4.9/5",
  ratingLabel: "تقييم العملاء",
  support: "24/7",
  supportLabel: "خدمة العملاء",
} as const;

// Services Data
export const SERVICES = [
  {
    id: "home-cleaning",
    title: "تنظيف المنازل والفلل",
    description: "خدمة تنظيف شاملة للمنازل والفلل مع ضمان الجودة",
    icon: "🏠",
    category: "residential",
  },
  {
    id: "office-cleaning",
    title: "تنظيف المكاتب والشركات",
    description: "حلول تنظيف احترافية للمكاتب والمباني التجارية",
    icon: "🏢",
    category: "commercial",
  },
  {
    id: "carpet-cleaning",
    title: "تنظيف السجاد والستائر",
    description: "خدمة تنظيف وتعقيم السجاد والستائر بأحدث التقنيات",
    icon: "🧽",
    category: "specialized",
  },
  {
    id: "marble-polishing",
    title: "جلي وتلميع الرخام",
    description: "تلميع وصيانة الأرضيات الرخامية والبلاط",
    icon: "✨",
    category: "specialized",
  },
  {
    id: "tank-cleaning",
    title: "تنظيف خزانات المياه",
    description: "تنظيف وتعقيم خزانات المياه وفقاً للمعايير الصحية",
    icon: "💧",
    category: "specialized",
  },
  {
    id: "pest-control",
    title: "مكافحة الحشرات",
    description: "خدمات مكافحة الحشرات والقوارض بمواد آمنة",
    icon: "🛡️",
    category: "specialized",
  },
] as const;

// Features Data
export const FEATURES = [
  {
    id: "guarantee",
    title: "ضمان 100%",
    description:
      "ضمان شامل على جميع خدماتنا مع إمكانية الإعادة في حالة عدم الرضا",
    iconType: "shield",
  },
  {
    id: "speed",
    title: "خدمة سريعة",
    description:
      "فريق عمل محترف ينجز المهام في الوقت المحدد بأعلى معايير الجودة",
    iconType: "clock",
  },
  {
    id: "quality",
    title: "جودة عالية",
    description:
      "استخدام أفضل المعدات والمواد الصديقة للبيئة والآمنة على الصحة",
    iconType: "award",
  },
] as const;

// Benefits Data
export const BENEFITS = [
  "معدات حديثة ومتطورة",
  "فريق مدرب ومؤهل",
  "أسعار تنافسية وعادلة",
] as const;

// Testimonials Data
export const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "أحمد محمد",
    rating: 5,
    comment:
      "خدمة ممتازة وفريق محترف. تم تنظيف منزلي بشكل مثالي والنتيجة فاقت توقعاتي.",
    service: "تنظيف منزل",
    serviceId: "home-cleaning",
  },
  {
    id: "testimonial-2",
    name: "فاطمة الأحمدي",
    rating: 5,
    comment:
      "سرعة في الأداء ودقة في العمل. أنصح الجميع بالتعامل مع عالم النظافة.",
    service: "تنظيف مكتب",
    serviceId: "office-cleaning",
  },
  {
    id: "testimonial-3",
    name: "محمد العتيبي",
    rating: 5,
    comment: "تعامل راقي وأسعار معقولة. السجاد أصبح ��الجديد تماماً.",
    service: "تنظيف سجاد",
    serviceId: "carpet-cleaning",
  },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { label: "الرئيسية", href: "#home" },
  { label: "خدماتنا", href: "#services" },
  { label: "من نحن", href: "#about" },
  { label: "اتصل بنا", href: "#contact" },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { name: "تنظيف المنازل", href: "#" },
    { name: "تنظيف المكاتب", href: "#" },
    { name: "تنظيف السجاد", href: "#" },
    { name: "جلي الرخام", href: "#" },
  ],
  links: [
    { name: "من نحن", href: "#" },
    { name: "اتصل بنا", href: "#" },
    { name: "سياسة الخصوصية", href: "#" },
    { name: "شروط الاستخدام", href: "#" },
  ],
  social: [
    { icon: "📘", href: "#", label: "Facebook" },
    { icon: "📱", href: "#", label: "WhatsApp" },
    { icon: "🐦", href: "#", label: "Twitter" },
    { icon: "📷", href: "#", label: "Instagram" },
  ],
} as const;

// Animation configurations
export const ANIMATIONS = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  pulse: "animate-pulse-glow",
  hover: "hover:shadow-xl transition-shadow duration-300",
  button: "transition-colors duration-200",
} as const;

// Responsive breakpoints for consistent grid usage
export const GRID_LAYOUTS = {
  stats: "grid-cols-2 md:grid-cols-4",
  services: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  features: "grid-cols-1 md:grid-cols-3",
  testimonials: "grid-cols-1 md:grid-cols-3",
  contact: "grid-cols-1 md:grid-cols-3",
  footer: "grid-cols-1 md:grid-cols-4",
  aboutStats: "grid-cols-2",
} as const;

// API defaults and validation rules for api-utils
export const DEFAULT_RESPONSES = {
  array: [] as any[],
  object: {} as Record<string, any>,
  number: 0,
  string: "",
  boolean: false,
};

export const VALIDATION_RULES = {
  required: (v: any) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== ""),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9\-()\s]{7,}$/,
};
