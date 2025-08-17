import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  colorPaletteService,
  ColorPalette,
} from "../services/colorPaletteService";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activePalette: ColorPalette | null;
  setActivePalette: (palette: ColorPalette) => void;
  isAnimating: boolean;
  transitionDuration: number;
  setTransitionDuration: (duration: number) => void;
  applyPalette: (palette: ColorPalette, animate?: boolean) => void;
  previewPalette: (palette: ColorPalette) => void;
  cancelPreview: () => void;
  isPreviewMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableTransitions?: boolean;
  transitionDuration?: number;
}

export function EnhancedThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "enhanced-ui-theme",
  enableTransitions = true,
  transitionDuration: defaultTransitionDuration = 300,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [activePalette, setActivePalette] = useState<ColorPalette | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(
    defaultTransitionDuration,
  );
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(
    null,
  );
  const [originalPalette, setOriginalPalette] = useState<ColorPalette | null>(
    null,
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply theme transitions
    if (enableTransitions) {
      root.style.setProperty(
        "--theme-transition-duration",
        `${transitionDuration}ms`,
      );
      root.classList.add("theme-transition");
    }

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, enableTransitions, transitionDuration]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Load initial palette
  useEffect(() => {
    const loadActivePalette = async () => {
      try {
        const palette = await colorPaletteService.getActivePalette();
        setActivePalette(palette);
        applyPaletteToDOM(palette, false);
      } catch (error) {
        console.error("خطأ في تحميل الباليت النشط:", error);
      }
    };

    loadActivePalette();
  }, []);

  const applyPaletteToDOM = (
    palette: ColorPalette,
    animate: boolean = true,
  ) => {
    const root = document.documentElement;

    if (animate && enableTransitions) {
      setIsAnimating(true);

      // Add animation class
      root.classList.add("palette-transition");

      // Apply transition timing
      root.style.setProperty(
        "--palette-transition-duration",
        `${transitionDuration}ms`,
      );

      setTimeout(() => {
        setIsAnimating(false);
        root.classList.remove("palette-transition");
      }, transitionDuration);
    }

    // Apply palette colors with CSS custom properties
    Object.entries(palette.colors).forEach(([colorName, colorValue]) => {
      const cssVar = `--color-${colorName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, colorValue);
    });

    // Apply CSS variables from palette
    Object.entries(palette.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply semantic color mappings
    const colorMappings = {
      "--primary": palette.colors.primary,
      "--primary-foreground": palette.colors.text,
      "--secondary": palette.colors.secondary,
      "--secondary-foreground": palette.colors.textSecondary,
      "--accent": palette.colors.accent,
      "--accent-foreground": palette.colors.text,
      "--background": palette.colors.background,
      "--foreground": palette.colors.text,
      "--muted": palette.colors.surface,
      "--muted-foreground": palette.colors.textSecondary,
      "--border": palette.colors.border,
      "--input": palette.colors.surface,
      "--ring": palette.colors.accent,
      "--destructive": palette.colors.error,
      "--destructive-foreground": palette.colors.background,
      "--success": palette.colors.success,
      "--success-foreground": palette.colors.background,
      "--warning": palette.colors.warning,
      "--warning-foreground": palette.colors.background,
      "--info": palette.colors.info,
      "--info-foreground": palette.colors.background,
    };

    Object.entries(colorMappings).forEach(([property, value]) => {
      // Convert hex to HSL if needed
      const hslValue = convertToHSL(value);
      root.style.setProperty(property, hslValue);
    });

    // Apply advanced styling properties
    const advancedProperties = {
      "--radius": palette.cssVariables["--radius"] || "0.5rem",
      "--shadow-color": `${convertToHSL(palette.colors.text)} / 0.1`,
      "--ring-offset-shadow": `0 0 0 var(--ring-offset-width) var(--ring-offset-color)`,
      "--ring-shadow": `0 0 0 calc(var(--ring-width) + var(--ring-offset-width)) var(--ring)`,
    };

    Object.entries(advancedProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const convertToHSL = (colorValue: string): string => {
    // If already in HSL format, extract values
    if (colorValue.includes("%")) {
      return colorValue.replace(/hsl\(|\)/g, "");
    }

    // Convert hex to HSL
    if (colorValue.startsWith("#")) {
      const hsl = hexToHsl(colorValue);
      return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
    }

    return colorValue;
  };

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const applyPalette = (palette: ColorPalette, animate: boolean = true) => {
    setActivePalette(palette);
    applyPaletteToDOM(palette, animate);
  };

  const handlePreviewPalette = (palette: ColorPalette) => {
    if (!isPreviewMode) {
      setOriginalPalette(activePalette);
      setIsPreviewMode(true);
    }
    setPreviewPalette(palette);
    applyPaletteToDOM(palette, true);
  };

  const cancelPreview = () => {
    if (originalPalette && isPreviewMode) {
      applyPaletteToDOM(originalPalette, true);
      setActivePalette(originalPalette);
      setPreviewPalette(null);
      setOriginalPalette(null);
      setIsPreviewMode(false);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    activePalette,
    setActivePalette,
    isAnimating,
    transitionDuration,
    setTransitionDuration,
    applyPalette,
    previewPalette: handlePreviewPalette,
    cancelPreview,
    isPreviewMode,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}

      {/* Global Theme Styles */}
      <style>{`
        :root {
          --theme-transition-duration: ${transitionDuration}ms;
          --palette-transition-duration: ${transitionDuration}ms;
        }

        .theme-transition,
        .theme-transition *,
        .theme-transition *:before,
        .theme-transition *:after {
          transition: 
            background-color var(--theme-transition-duration) ease-in-out,
            border-color var(--theme-transition-duration) ease-in-out,
            color var(--theme-transition-duration) ease-in-out,
            fill var(--theme-transition-duration) ease-in-out,
            stroke var(--theme-transition-duration) ease-in-out,
            box-shadow var(--theme-transition-duration) ease-in-out,
            opacity var(--theme-transition-duration) ease-in-out !important;
        }

        .palette-transition,
        .palette-transition *,
        .palette-transition *:before,
        .palette-transition *:after {
          transition: 
            background-color var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            border-color var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            color var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            fill var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            stroke var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1),
            backdrop-filter var(--palette-transition-duration) cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Enhanced focus styles */
        *:focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
          transition: outline-color 150ms ease-in-out;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Enhanced animations for interactive elements */
        button, 
        [role="button"],
        input,
        select,
        textarea {
          transition: 
            all 200ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:hover,
        [role="button"]:hover {
          transform: translateY(-1px);
          box-shadow: 
            0 4px 6px -1px hsl(var(--shadow-color)),
            0 2px 4px -1px hsl(var(--shadow-color));
        }

        button:active,
        [role="button"]:active {
          transform: translateY(0);
          transition-duration: 100ms;
        }

        /* Card hover effects */
        [data-card="true"] {
          transition: 
            transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-card="true"]:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 10px 15px -3px hsl(var(--shadow-color)),
            0 4px 6px -2px hsl(var(--shadow-color));
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .theme-transition,
          .theme-transition *,
          .palette-transition,
          .palette-transition *,
          button,
          [role="button"],
          [data-card="true"] {
            transition: none !important;
            animation: none !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :root {
            --border: 0 0% 20%;
            --ring: 0 0% 30%;
          }
          
          button,
          [role="button"] {
            border: 2px solid hsl(var(--border));
          }
        }

        /* Dark mode specific enhancements */
        .dark {
          color-scheme: dark;
        }
        
        .dark img {
          filter: brightness(0.9);
        }
        
        .dark [data-card="true"] {
          backdrop-filter: blur(8px);
        }

        /* Light mode specific enhancements */
        .light {
          color-scheme: light;
        }
        
        .light [data-card="true"] {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </ThemeContext.Provider>
  );
}

export const useEnhancedTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useEnhancedTheme must be used within an EnhancedThemeProvider",
    );
  }

  return context;
};

export default EnhancedThemeProvider;
