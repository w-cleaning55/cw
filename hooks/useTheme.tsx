"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  THEMES,
  DEFAULT_THEME_SETTINGS,
  getCurrentTheme,
  updateThemeCSS,
  saveThemeSettings,
  loadThemeSettings,
  getSystemDarkMode,
  type Theme,
  type ColorPalette,
} from "@/lib/theme-system";

interface ThemeContextType {
  // الثيم الحالي
  currentTheme: string;
  setCurrentTheme: (themeId: string) => void;
  toggleTheme: () => void;

  // الدارك مود
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;

  // التبديل التلقائي
  autoTheme: boolean;
  setAutoTheme: (auto: boolean) => void;

  // ال��لوان الحالية
  colors: ColorPalette;

  // الثيم الكامل
  theme: Theme;

  // الإعدادات المخصصة
  customization: typeof DEFAULT_THEME_SETTINGS.customization;
  setCustomization: (
    settings: Partial<typeof DEFAULT_THEME_SETTINGS.customization>,
  ) => void;

  // دوال مساعدة
  getAvailableThemes: () => Record<string, Theme>;
  themes: Record<string, Theme>;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_THEME_SETTINGS);
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  // تحديد الدارك مود الفعلي
  const isDarkMode = settings.autoTheme ? systemDarkMode : settings.darkMode;

  // الألوان والثيم الحالي
  const colors = getCurrentTheme(settings.currentTheme, isDarkMode);
  const theme = THEMES[settings.currentTheme] || THEMES.oceanBlue;

  // تحميل الإعدادات عن�� بدء التشغيل
  useEffect(() => {
    const savedSettings = loadThemeSettings();
    setSettings(savedSettings);

    // اكتشاف الدارك مود من النظام
    const systemDark = getSystemDarkMode();
    setSystemDarkMode(systemDark);

    // مراقبة تغييرات النظام
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemDarkMode(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // تطبيق الثيم عند التغيير
  useEffect(() => {
    updateThemeCSS(settings.currentTheme, isDarkMode);
    saveThemeSettings(settings);
  }, [settings, isDarkMode]);

  // دوال التحكم في الثيم
  const setCurrentTheme = useCallback((themeId: string) => {
    if (THEMES[themeId]) {
      setSettings((prev) => ({ ...prev, currentTheme: themeId }));
    }
  }, []);

  const setDarkMode = useCallback((isDark: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode: isDark, autoTheme: false }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!settings.darkMode);
  }, [settings.darkMode, setDarkMode]);

  const toggleTheme = useCallback(() => {
    const themeIds = Object.keys(THEMES);
    const currentIndex = themeIds.indexOf(settings.currentTheme);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    setCurrentTheme(themeIds[nextIndex]);
  }, [settings.currentTheme, setCurrentTheme]);

  const setAutoTheme = useCallback((auto: boolean) => {
    setSettings((prev) => ({ ...prev, autoTheme: auto }));
  }, []);

  const setCustomization = useCallback(
    (newSettings: Partial<typeof DEFAULT_THEME_SETTINGS.customization>) => {
      setSettings((prev) => ({
        ...prev,
        customization: { ...prev.customization, ...newSettings },
      }));
    },
    [],
  );

  const getAvailableThemes = useCallback(() => {
    return THEMES;
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_THEME_SETTINGS);
  }, []);

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((settingsString: string) => {
    try {
      const importedSettings = JSON.parse(settingsString);

      // التحقق من صحة البيانات
      if (
        importedSettings.currentTheme &&
        THEMES[importedSettings.currentTheme]
      ) {
        setSettings({ ...DEFAULT_THEME_SETTINGS, ...importedSettings });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing theme settings:", error);
      return false;
    }
  }, []);

  const contextValue: ThemeContextType = {
    currentTheme: settings.currentTheme,
    setCurrentTheme,
    isDarkMode,
    setDarkMode,
    toggleDarkMode,
    toggleTheme,
    autoTheme: settings.autoTheme,
    setAutoTheme,
    colors,
    theme,
    customization: settings.customization,
    setCustomization,
    getAvailableThemes,
    resetToDefaults,
    exportSettings,
    importSettings,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook مبسط للمكونات التي تحتاج الألوان فقط
export function useThemeColors() {
  const { colors, isDarkMode, currentTheme } = useTheme();
  return { colors, isDarkMode, currentTheme };
}

// Hook للتحكم في الدارك مود فقط
export function useDarkMode() {
  const { isDarkMode, setDarkMode, toggleDarkMode, autoTheme, setAutoTheme } =
    useTheme();
  return { isDarkMode, setDarkMode, toggleDarkMode, autoTheme, setAutoTheme };
}

// Hook للحصول على كلاسات CSS المناسبة للثيم
export function useThemeClasses() {
  const { colors, isDarkMode, currentTheme, customization } = useTheme();

  const getBackgroundClass = useCallback(
    (
      type: "primary" | "secondary" | "surface" | "background" = "background",
    ) => {
      const baseClasses = {
        primary: "bg-[var(--color-primary)]",
        secondary: "bg-[var(--color-secondary)]",
        surface: "bg-[var(--color-surface)]",
        background: "bg-[var(--color-background)]",
      };

      let classes = baseClasses[type];

      if (isDarkMode) {
        classes += " dark:bg-[var(--color-surface-dark)]";
      }

      return classes;
    },
    [isDarkMode],
  );

  const getTextClass = useCallback(
    (type: "primary" | "secondary" | "accent" = "primary") => {
      const baseClasses = {
        primary: "text-[var(--color-text)]",
        secondary: "text-[var(--color-text-secondary)]",
        accent: "text-[var(--color-accent)]",
      };

      let classes = baseClasses[type];

      if (isDarkMode && type === "primary") {
        classes += " dark:text-[var(--color-text-dark)]";
      } else if (isDarkMode && type === "secondary") {
        classes += " dark:text-[var(--color-text-secondary-dark)]";
      }

      return classes;
    },
    [isDarkMode],
  );

  const getBorderClass = useCallback(
    (type: "default" | "primary" | "accent" = "default") => {
      const baseClasses = {
        default: "border-[var(--color-border)]",
        primary: "border-[var(--color-primary)]",
        accent: "border-[var(--color-accent)]",
      };

      let classes = baseClasses[type];

      if (isDarkMode && type === "default") {
        classes += " dark:border-[var(--color-border-dark)]";
      }

      return classes;
    },
    [isDarkMode],
  );

  const getShadowClass = useCallback(
    (size: "sm" | "md" | "lg" | "xl" = "md") => {
      if (!customization.enableShadows) return "";

      const shadowClasses = {
        sm: "shadow-[var(--shadow-sm)]",
        md: "shadow-[var(--shadow-md)]",
        lg: "shadow-[var(--shadow-lg)]",
        xl: "shadow-[var(--shadow-xl)]",
      };

      return shadowClasses[size];
    },
    [customization.enableShadows],
  );

  const getGradientClass = useCallback(
    (type: "primary" | "secondary" = "primary") => {
      if (!customization.enableGradients) return "";

      const gradientClasses = {
        primary: "bg-[var(--gradient-primary)]",
        secondary: "bg-[var(--gradient-secondary)]",
      };

      return gradientClasses[type];
    },
    [customization.enableGradients],
  );

  const getRoundedClass = useCallback(
    (size: "sm" | "md" | "lg" | "xl" = "md") => {
      const roundedClasses = {
        sm: "rounded-[var(--radius-sm)]",
        md: "rounded-[var(--radius-md)]",
        lg: "rounded-[var(--radius-lg)]",
        xl: "rounded-[var(--radius-xl)]",
      };

      return roundedClasses[size];
    },
    [],
  );

  return {
    getBackgroundClass,
    getTextClass,
    getBorderClass,
    getShadowClass,
    getGradientClass,
    getRoundedClass,
    // كلاس��ت مباشرة
    bg: {
      primary: getBackgroundClass("primary"),
      secondary: getBackgroundClass("secondary"),
      surface: getBackgroundClass("surface"),
      background: getBackgroundClass("background"),
    },
    text: {
      primary: getTextClass("primary"),
      secondary: getTextClass("secondary"),
      accent: getTextClass("accent"),
    },
    border: {
      default: getBorderClass("default"),
      primary: getBorderClass("primary"),
      accent: getBorderClass("accent"),
    },
    shadow: {
      sm: getShadowClass("sm"),
      md: getShadowClass("md"),
      lg: getShadowClass("lg"),
      xl: getShadowClass("xl"),
    },
    rounded: {
      sm: getRoundedClass("sm"),
      md: getRoundedClass("md"),
      lg: getRoundedClass("lg"),
      xl: getRoundedClass("xl"),
    },
  };
}

// Hook للتحكم في الثيم من المكونات
export function useThemeControl() {
  const {
    currentTheme,
    setCurrentTheme,
    getAvailableThemes,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useTheme();

  return {
    currentTheme,
    setCurrentTheme,
    availableThemes: getAvailableThemes(),
    resetToDefaults,
    exportSettings,
    importSettings,
  };
}
