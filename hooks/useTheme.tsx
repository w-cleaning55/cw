"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Determine if we're in dark mode
  const isDark = resolvedTheme === "dark";

  // Handle theme toggle
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "system",
          setTheme: () => {},
          isDark: false,
          toggleTheme: () => {},
          isLoading: true,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: (theme as Theme) || "system",
        setTheme: (newTheme: Theme) => setTheme(newTheme),
        isDark,
        toggleTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme utilities
export function getThemeIcon(theme: Theme, isDark: boolean) {
  switch (theme) {
    case "light":
      return "☀️";
    case "dark":
      return "🌙";
    case "system":
      return isDark ? "🌙" : "☀️";
    default:
      return "☀️";
  }
}

export function getThemeLabel(theme: Theme, isDark: boolean) {
  switch (theme) {
    case "light":
      return "فاتح";
    case "dark":
      return "داكن";
    case "system":
      return isDark ? "داكن (تلقائي)" : "فاتح (تلقائي)";
    default:
      return "تلقائي";
  }
}

// CSS Variables for theme colors
export const themeColors = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    card: "hsl(0 0% 100%)",
    "card-foreground": "hsl(222.2 84% 4.9%)",
    popover: "hsl(0 0% 100%)",
    "popover-foreground": "hsl(222.2 84% 4.9%)",
    primary: "hsl(221.2 83.2% 53.3%)",
    "primary-foreground": "hsl(210 40% 98%)",
    secondary: "hsl(210 40% 96%)",
    "secondary-foreground": "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96%)",
    "muted-foreground": "hsl(215.4 16.3% 46.9%)",
    accent: "hsl(210 40% 96%)",
    "accent-foreground": "hsl(222.2 84% 4.9%)",
    destructive: "hsl(0 84.2% 60.2%)",
    "destructive-foreground": "hsl(210 40% 98%)",
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(221.2 83.2% 53.3%)",
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    card: "hsl(222.2 84% 4.9%)",
    "card-foreground": "hsl(210 40% 98%)",
    popover: "hsl(222.2 84% 4.9%)",
    "popover-foreground": "hsl(210 40% 98%)",
    primary: "hsl(217.2 91.2% 59.8%)",
    "primary-foreground": "hsl(222.2 84% 4.9%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    "secondary-foreground": "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    "muted-foreground": "hsl(215 20.2% 65.1%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    "accent-foreground": "hsl(210 40% 98%)",
    destructive: "hsl(0 62.8% 30.6%)",
    "destructive-foreground": "hsl(210 40% 98%)",
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(224.3 76.3% 94.1%)",
  },
};

// Apply theme colors to CSS variables
export function applyThemeColors(isDark: boolean) {
  const colors = isDark ? themeColors.dark : themeColors.light;
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

// Theme hook for components that need theme-aware styling
export function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? themeColors.dark : themeColors.light;
}
