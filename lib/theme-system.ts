// نظام الثيمات المركزي مع دعم الدارك مود والأربع ثيمات

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  neutral: string;
  neutralDark: string;
  neutralLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundDark: string;
  surface: string;
  surfaceDark: string;
  text: string;
  textDark: string;
  textSecondary: string;
  textSecondaryDark: string;
  border: string;
  borderDark: string;
}

export interface Theme {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  light: ColorPalette;
  dark: ColorPalette;
  gradient?: {
    primary: string;
    secondary: string;
  };
  shadows?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// الثيمات الأربعة الأساسية
export const THEMES: Record<string, Theme> = {
  oceanBlue: {
    id: "oceanBlue",
    name: {
      ar: "أزرق المحيط",
      en: "Ocean Blue",
    },
    description: {
      ar: "ثيم أزرق هادئ مستوحى من المحيط",
      en: "Calm blue theme inspired by the ocean",
    },
    light: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      primaryLight: "#3b82f6",
      secondary: "#06b6d4",
      secondaryDark: "#0891b2",
      secondaryLight: "#22d3ee",
      accent: "#0ea5e9",
      accentDark: "#0284c7",
      accentLight: "#38bdf8",
      neutral: "#64748b",
      neutralDark: "#475569",
      neutralLight: "#94a3b8",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      background: "#ffffff",
      backgroundDark: "#f8fafc",
      surface: "#f1f5f9",
      surfaceDark: "#e2e8f0",
      text: "#0f172a",
      textDark: "#334155",
      textSecondary: "#64748b",
      textSecondaryDark: "#94a3b8",
      border: "#e2e8f0",
      borderDark: "#cbd5e1",
    },
    dark: {
      primary: "#3b82f6",
      primaryDark: "#2563eb",
      primaryLight: "#60a5fa",
      secondary: "#22d3ee",
      secondaryDark: "#06b6d4",
      secondaryLight: "#67e8f9",
      accent: "#38bdf8",
      accentDark: "#0ea5e9",
      accentLight: "#7dd3fc",
      neutral: "#94a3b8",
      neutralDark: "#64748b",
      neutralLight: "#cbd5e1",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
      background: "#0f172a",
      backgroundDark: "#020617",
      surface: "#1e293b",
      surfaceDark: "#334155",
      text: "#f8fafc",
      textDark: "#e2e8f0",
      textSecondary: "#cbd5e1",
      textSecondaryDark: "#94a3b8",
      border: "#334155",
      borderDark: "#475569",
    },
    gradient: {
      primary: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
      secondary: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(59 130 246 / 0.05)",
      md: "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
      lg: "0 10px 15px -3px rgb(59 130 246 / 0.1), 0 4px 6px -4px rgb(59 130 246 / 0.1)",
      xl: "0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
  },

  forestGreen: {
    id: "forestGreen",
    name: {
      ar: "أخضر الغابة",
      en: "Forest Green",
    },
    description: {
      ar: "ثيم أخضر طبيعي مستوحى من الغابات",
      en: "Natural green theme inspired by forests",
    },
    light: {
      primary: "#059669",
      primaryDark: "#047857",
      primaryLight: "#10b981",
      secondary: "#84cc16",
      secondaryDark: "#65a30d",
      secondaryLight: "#a3e635",
      accent: "#22c55e",
      accentDark: "#16a34a",
      accentLight: "#4ade80",
      neutral: "#6b7280",
      neutralDark: "#4b5563",
      neutralLight: "#9ca3af",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      background: "#ffffff",
      backgroundDark: "#f9fafb",
      surface: "#f3f4f6",
      surfaceDark: "#e5e7eb",
      text: "#111827",
      textDark: "#374151",
      textSecondary: "#6b7280",
      textSecondaryDark: "#9ca3af",
      border: "#e5e7eb",
      borderDark: "#d1d5db",
    },
    dark: {
      primary: "#10b981",
      primaryDark: "#059669",
      primaryLight: "#34d399",
      secondary: "#a3e635",
      secondaryDark: "#84cc16",
      secondaryLight: "#bef264",
      accent: "#4ade80",
      accentDark: "#22c55e",
      accentLight: "#86efac",
      neutral: "#9ca3af",
      neutralDark: "#6b7280",
      neutralLight: "#d1d5db",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
      background: "#111827",
      backgroundDark: "#030712",
      surface: "#1f2937",
      surfaceDark: "#374151",
      text: "#f9fafb",
      textDark: "#e5e7eb",
      textSecondary: "#d1d5db",
      textSecondaryDark: "#9ca3af",
      border: "#374151",
      borderDark: "#4b5563",
    },
    gradient: {
      primary: "linear-gradient(135deg, #059669 0%, #84cc16 100%)",
      secondary: "linear-gradient(135deg, #22c55e 0%, #a3e635 100%)",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(16 185 129 / 0.05)",
      md: "0 4px 6px -1px rgb(16 185 129 / 0.1), 0 2px 4px -2px rgb(16 185 129 / 0.1)",
      lg: "0 10px 15px -3px rgb(16 185 129 / 0.1), 0 4px 6px -4px rgb(16 185 129 / 0.1)",
      xl: "0 20px 25px -5px rgb(16 185 129 / 0.1), 0 8px 10px -6px rgb(16 185 129 / 0.1)",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
  },

  steelGray: {
    id: "steelGray",
    name: {
      ar: "رمادي الفولاذ",
      en: "Steel Gray",
    },
    description: {
      ar: "ثيم رمادي أنيق ومهني",
      en: "Elegant and professional gray theme",
    },
    light: {
      primary: "#374151",
      primaryDark: "#1f2937",
      primaryLight: "#4b5563",
      secondary: "#6b7280",
      secondaryDark: "#4b5563",
      secondaryLight: "#9ca3af",
      accent: "#8b5cf6",
      accentDark: "#7c3aed",
      accentLight: "#a78bfa",
      neutral: "#6b7280",
      neutralDark: "#4b5563",
      neutralLight: "#9ca3af",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      background: "#ffffff",
      backgroundDark: "#f9fafb",
      surface: "#f3f4f6",
      surfaceDark: "#e5e7eb",
      text: "#111827",
      textDark: "#374151",
      textSecondary: "#6b7280",
      textSecondaryDark: "#9ca3af",
      border: "#e5e7eb",
      borderDark: "#d1d5db",
    },
    dark: {
      primary: "#6b7280",
      primaryDark: "#374151",
      primaryLight: "#9ca3af",
      secondary: "#9ca3af",
      secondaryDark: "#6b7280",
      secondaryLight: "#d1d5db",
      accent: "#a78bfa",
      accentDark: "#8b5cf6",
      accentLight: "#c4b5fd",
      neutral: "#9ca3af",
      neutralDark: "#6b7280",
      neutralLight: "#d1d5db",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
      background: "#111827",
      backgroundDark: "#030712",
      surface: "#1f2937",
      surfaceDark: "#374151",
      text: "#f9fafb",
      textDark: "#e5e7eb",
      textSecondary: "#d1d5db",
      textSecondaryDark: "#9ca3af",
      border: "#374151",
      borderDark: "#4b5563",
    },
    gradient: {
      primary: "linear-gradient(135deg, #374151 0%, #8b5cf6 100%)",
      secondary: "linear-gradient(135deg, #6b7280 0%, #a78bfa 100%)",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(55 65 81 / 0.05)",
      md: "0 4px 6px -1px rgb(55 65 81 / 0.1), 0 2px 4px -2px rgb(55 65 81 / 0.1)",
      lg: "0 10px 15px -3px rgb(55 65 81 / 0.1), 0 4px 6px -4px rgb(55 65 81 / 0.1)",
      xl: "0 20px 25px -5px rgb(55 65 81 / 0.1), 0 8px 10px -6px rgb(55 65 81 / 0.1)",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
  },

  earthCopper: {
    id: "earthCopper",
    name: {
      ar: "نحاسي الأرض",
      en: "Earth Copper",
    },
    description: {
      ar: "ثيم نحاسي دافئ مستوحى من الأرض",
      en: "Warm copper theme inspired by earth",
    },
    light: {
      primary: "#dc2626",
      primaryDark: "#b91c1c",
      primaryLight: "#ef4444",
      secondary: "#ea580c",
      secondaryDark: "#c2410c",
      secondaryLight: "#f97316",
      accent: "#d97706",
      accentDark: "#b45309",
      accentLight: "#f59e0b",
      neutral: "#78716c",
      neutralDark: "#57534e",
      neutralLight: "#a8a29e",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      background: "#ffffff",
      backgroundDark: "#fefaf8",
      surface: "#faf7f4",
      surfaceDark: "#f5f1ed",
      text: "#1c1917",
      textDark: "#44403c",
      textSecondary: "#78716c",
      textSecondaryDark: "#a8a29e",
      border: "#e7e5e4",
      borderDark: "#d6d3d1",
    },
    dark: {
      primary: "#ef4444",
      primaryDark: "#dc2626",
      primaryLight: "#f87171",
      secondary: "#f97316",
      secondaryDark: "#ea580c",
      secondaryLight: "#fb923c",
      accent: "#f59e0b",
      accentDark: "#d97706",
      accentLight: "#fbbf24",
      neutral: "#a8a29e",
      neutralDark: "#78716c",
      neutralLight: "#d6d3d1",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
      background: "#1c1917",
      backgroundDark: "#0c0a09",
      surface: "#292524",
      surfaceDark: "#44403c",
      text: "#fafaf9",
      textDark: "#f5f5f4",
      textSecondary: "#d6d3d1",
      textSecondaryDark: "#a8a29e",
      border: "#44403c",
      borderDark: "#57534e",
    },
    gradient: {
      primary: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
      secondary: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(220 38 38 / 0.05)",
      md: "0 4px 6px -1px rgb(220 38 38 / 0.1), 0 2px 4px -2px rgb(220 38 38 / 0.1)",
      lg: "0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -4px rgb(220 38 38 / 0.1)",
      xl: "0 20px 25px -5px rgb(220 38 38 / 0.1), 0 8px 10px -6px rgb(220 38 38 / 0.1)",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
  },
};

// إعدادات الثيم الافتراضية
export const DEFAULT_THEME_SETTINGS = {
  currentTheme: "oceanBlue",
  darkMode: false,
  autoTheme: false, // تبديل تلقائي حسب وقت النهار
  customization: {
    enableAnimations: true,
    enableShadows: true,
    enableGradients: true,
    enableBlur: true,
    compactMode: false,
    highContrast: false,
  },
};

// دالة للحصول على الثيم الحالي
export function getCurrentTheme(
  themeId: string,
  isDark: boolean,
): ColorPalette {
  const theme = THEMES[themeId] || THEMES.oceanBlue;
  return isDark ? theme.dark : theme.light;
}

// دالة لتوليد CSS variables للثيم
export function generateThemeCSS(themeId: string, isDark: boolean): string {
  const colors = getCurrentTheme(themeId, isDark);
  const theme = THEMES[themeId] || THEMES.oceanBlue;

  return `
    :root {
      --color-primary: ${colors.primary};
      --color-primary-dark: ${colors.primaryDark};
      --color-primary-light: ${colors.primaryLight};
      --color-secondary: ${colors.secondary};
      --color-secondary-dark: ${colors.secondaryDark};
      --color-secondary-light: ${colors.secondaryLight};
      --color-accent: ${colors.accent};
      --color-accent-dark: ${colors.accentDark};
      --color-accent-light: ${colors.accentLight};
      --color-neutral: ${colors.neutral};
      --color-neutral-dark: ${colors.neutralDark};
      --color-neutral-light: ${colors.neutralLight};
      --color-success: ${colors.success};
      --color-warning: ${colors.warning};
      --color-error: ${colors.error};
      --color-info: ${colors.info};
      --color-background: ${colors.background};
      --color-background-dark: ${colors.backgroundDark};
      --color-surface: ${colors.surface};
      --color-surface-dark: ${colors.surfaceDark};
      --color-text: ${colors.text};
      --color-text-dark: ${colors.textDark};
      --color-text-secondary: ${colors.textSecondary};
      --color-text-secondary-dark: ${colors.textSecondaryDark};
      --color-border: ${colors.border};
      --color-border-dark: ${colors.borderDark};
      
      --gradient-primary: ${theme.gradient?.primary || "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"};
      --gradient-secondary: ${theme.gradient?.secondary || "linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)"};
      
      --shadow-sm: ${theme.shadows?.sm || "0 1px 2px 0 rgb(0 0 0 / 0.05)"};
      --shadow-md: ${theme.shadows?.md || "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"};
      --shadow-lg: ${theme.shadows?.lg || "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"};
      --shadow-xl: ${theme.shadows?.xl || "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"};
      
      --radius-sm: ${theme.borderRadius?.sm || "0.375rem"};
      --radius-md: ${theme.borderRadius?.md || "0.5rem"};
      --radius-lg: ${theme.borderRadius?.lg || "0.75rem"};
      --radius-xl: ${theme.borderRadius?.xl || "1rem"};
      
      --mode: ${isDark ? "dark" : "light"};
    }
    
    .theme-${themeId} {
      color-scheme: ${isDark ? "dark" : "light"};
    }
    
    .theme-${themeId}.dark {
      color-scheme: dark;
    }
  `;
}

// دالة لتطبيق الثيم على العنصر
export function applyTheme(
  element: HTMLElement,
  themeId: string,
  isDark: boolean,
) {
  element.className = element.className.replace(/theme-\w+/g, "");
  element.classList.add(`theme-${themeId}`);
  if (isDark) {
    element.classList.add("dark");
  } else {
    element.classList.remove("dark");
  }
}

// دالة للتحقق من دعم الدارك مود في النظام
export function getSystemDarkMode(): boolean {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

// دالة لحفظ إعدادات الثيم
export function saveThemeSettings(settings: typeof DEFAULT_THEME_SETTINGS) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme-settings", JSON.stringify(settings));
  }
}

// دالة لاسترجاع إعدادات الثيم
export function loadThemeSettings(): typeof DEFAULT_THEME_SETTINGS {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme-settings");
    if (stored) {
      try {
        return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(stored) };
      } catch (error) {
        console.error("Error loading theme settings:", error);
      }
    }
  }
  return DEFAULT_THEME_SETTINGS;
}

// دالة لتحديث متغيرات CSS
export function updateThemeCSS(themeId: string, isDark: boolean) {
  if (typeof document !== "undefined") {
    const css = generateThemeCSS(themeId, isDark);
    let styleElement = document.getElementById("dynamic-theme-styles");

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dynamic-theme-styles";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;

    // تطبيق الثيم على body
    applyTheme(document.body, themeId, isDark);
  }
}

// كلاسات CSS مساعدة للمكونات
export const THEME_CLASSES = {
  // خلفيات
  bgPrimary: "bg-[var(--color-primary)]",
  bgSecondary: "bg-[var(--color-secondary)]",
  bgAccent: "bg-[var(--color-accent)]",
  bgSurface: "bg-[var(--color-surface)]",
  bgBackground: "bg-[var(--color-background)]",

  // نصوص
  textPrimary: "text-[var(--color-text)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textAccent: "text-[var(--color-accent)]",

  // حدود
  borderColor: "border-[var(--color-border)]",
  borderPrimary: "border-[var(--color-primary)]",

  // ظلال
  shadowSm: "shadow-[var(--shadow-sm)]",
  shadowMd: "shadow-[var(--shadow-md)]",
  shadowLg: "shadow-[var(--shadow-lg)]",
  shadowXl: "shadow-[var(--shadow-xl)]",

  // انحناءات
  roundedSm: "rounded-[var(--radius-sm)]",
  roundedMd: "rounded-[var(--radius-md)]",
  roundedLg: "rounded-[var(--radius-lg)]",
  roundedXl: "rounded-[var(--radius-xl)]",

  // تدرجات
  gradientPrimary:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]",
  gradientSecondary:
    "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)]",
};
