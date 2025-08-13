let translations: Record<string, any> = {};
let currentLanguage = "ar";
let isInitialized = false;

// Default fallback translations
const fallbackTranslations = {
  ar: {
    common: {
      loading: "جارٍ التحميل...",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      add: "إضافة",
      view: "عرض",
      home: "الرئيسية",
      services: "الخدمات",
      about: "من نحن",
      contact: "اتصل بنا",
    },
    navigation: {
      home: "الرئيسية",
      services: "خدماتنا",
      about: "من نحن",
      contact: "اتصل بنا",
    },
  },
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      view: "View",
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
    },
    navigation: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
    },
  },
};

// Translation helper functions
export const initializeTranslations = async (language: string = "ar") => {
  if (typeof window === "undefined") {
    // Server-side initialization
    currentLanguage = language;
    translations =
      fallbackTranslations[language as keyof typeof fallbackTranslations] ||
      fallbackTranslations.ar;
    isInitialized = true;
    return;
  }

  try {
    currentLanguage = language;

    // Set document language immediately
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    // Use fallback first
    translations =
      fallbackTranslations[language as keyof typeof fallbackTranslations] ||
      fallbackTranslations.ar;
    isInitialized = true;

    // Try to load full translations
    const response = await fetch(`/i18n/${language}.json`);
    if (response.ok) {
      const fullTranslations = await response.json();
      translations = fullTranslations;

      // Save language preference
      localStorage.setItem("preferred-language", language);
    } else {
      console.warn(
        `Failed to load translations for ${language}, using fallback`,
      );
    }
  } catch (error) {
    console.warn("Error loading translations, using fallback:", error);
    // Use fallback translations
    translations =
      fallbackTranslations[language as keyof typeof fallbackTranslations] ||
      fallbackTranslations.ar;
    isInitialized = true;
  }
};

// Get translation by key with dot notation support
export const t = (
  key: string,
  params?: Record<string, string | number>,
): string => {
  if (typeof window === "undefined") {
    // Server-side fallback
    return key;
  }

  if (!isInitialized) {
    initializeTranslations(currentLanguage);
    return key;
  }

  const keys = key.split(".");
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace parameters if provided
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
};

// Get current language
export const getCurrentLanguage = (): string => {
  if (typeof window === "undefined") {
    return currentLanguage;
  }

  return localStorage.getItem("preferred-language") || currentLanguage;
};

// Set language and reload translations
export const setLanguage = async (language: string): Promise<void> => {
  if (language === currentLanguage && isInitialized) {
    return;
  }

  await initializeTranslations(language);

  // Emit custom event for components to react to language change
  if (typeof window !== "undefined") {
    const event = new CustomEvent("languageChanged", {
      detail: { language, translations },
    });
    window.dispatchEvent(event);
  }
};

// Check if current language is RTL
export const isRTL = (): boolean => {
  return currentLanguage === "ar";
};

// Get available languages
export const getAvailableLanguages = () => {
  return [
    { code: "ar", name: "العربية", nativeName: "العربية", dir: "rtl" },
    { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  ];
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = "SAR",
): string => {
  const locale = currentLanguage === "ar" ? "ar-SA" : "en-SA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const locale = currentLanguage === "ar" ? "ar-SA" : "en-SA";
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    dateObj,
  );
};

// Format time
export const formatTime = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const locale = currentLanguage === "ar" ? "ar-SA" : "en-SA";
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    dateObj,
  );
};

// Format number
export const formatNumber = (number: number): string => {
  const locale = currentLanguage === "ar" ? "ar-SA" : "en-SA";

  return new Intl.NumberFormat(locale).format(number);
};

// Get translated company info
export const getCompanyInfo = () => {
  const prefix = "company";

  return {
    name: t(`${prefix}.name`),
    slogan: t(`${prefix}.slogan`),
    address: t(`${prefix}.address`),
    phone: t(`${prefix}.phone`),
    whatsapp: t(`${prefix}.whatsapp`),
    email: t(`${prefix}.email`),
    website: t(`${prefix}.website`),
    license: t(`${prefix}.license`),
    taxNumber: t(`${prefix}.taxNumber`),
    established: t(`${prefix}.established`),
    experience: t(`${prefix}.experience`),
  };
};

// Get relative time (e.g., "منذ 5 دقائق", "5 minutes ago")
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (currentLanguage === "ar") {
    if (diffInSeconds < 60) return "منذ لحظات";
    if (diffInSeconds < 3600)
      return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400)
      return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000)
      return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return formatDate(dateObj);
  } else {
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateObj);
  }
};

// Lazy initialization for browser environment
if (typeof window !== "undefined") {
  // Initialize with saved language or default to Arabic
  const savedLanguage = localStorage.getItem("preferred-language") || "ar";
  initializeTranslations(savedLanguage);
}

export default {
  t,
  getCurrentLanguage,
  setLanguage,
  isRTL,
  getAvailableLanguages,
  formatCurrency,
  formatDate,
  formatTime,
  formatNumber,
  getCompanyInfo,
  getRelativeTime,
  initializeTranslations,
};
