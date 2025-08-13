import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AnimationSettings {
  duration: {
    fast: number;
    normal: number;
    slow: number;
    ultra: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
    back: string;
    smooth: string;
  };
  delays: {
    none: number;
    short: number;
    medium: number;
    long: number;
  };
  enabled: boolean;
  reducedMotion: boolean;
  globalSpeed: number; // 0.5 = half speed, 2 = double speed
}

interface AnimationContextType {
  settings: AnimationSettings;
  updateSettings: (newSettings: Partial<AnimationSettings>) => void;
  setGlobalSpeed: (speed: number) => void;
  enableAnimations: (enabled: boolean) => void;
  getDuration: (type: keyof AnimationSettings["duration"]) => number;
  getEasing: (type: keyof AnimationSettings["easing"]) => string;
  getDelay: (type: keyof AnimationSettings["delays"]) => number;
  createTransition: (
    property: string,
    duration?: keyof AnimationSettings["duration"],
    easing?: keyof AnimationSettings["easing"],
    delay?: keyof AnimationSettings["delays"],
  ) => string;
  isAnimationEnabled: () => boolean;
}

const defaultSettings: AnimationSettings = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    ultra: 1000,
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    back: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  delays: {
    none: 0,
    short: 100,
    medium: 200,
    long: 500,
  },
  enabled: true,
  reducedMotion: false,
  globalSpeed: 1,
};

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

interface AnimationControllerProps {
  children: ReactNode;
  initialSettings?: Partial<AnimationSettings>;
}

export function AnimationController({
  children,
  initialSettings,
}: AnimationControllerProps) {
  const [settings, setSettings] = useState<AnimationSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  const [isClient, setIsClient] = useState(false);

  // Client-side only flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for reduced motion preference (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      setSettings((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
        enabled: !mediaQuery.matches && prev.enabled,
      }));
    };

    handleChange(); // Initial check
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isClient]);

  // Apply global CSS variables (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    const root = document.documentElement;

    // Duration variables
    Object.entries(settings.duration).forEach(([key, value]) => {
      const adjustedValue = Math.round(value * settings.globalSpeed);
      root.style.setProperty(`--duration-${key}`, `${adjustedValue}ms`);
    });

    // Easing variables
    Object.entries(settings.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value);
    });

    // Delay variables
    Object.entries(settings.delays).forEach(([key, value]) => {
      const adjustedValue = Math.round(value * settings.globalSpeed);
      root.style.setProperty(`--delay-${key}`, `${adjustedValue}ms`);
    });

    // Global animation state
    root.style.setProperty(
      "--animation-enabled",
      settings.enabled && !settings.reducedMotion ? "1" : "0",
    );
    root.style.setProperty("--global-speed", settings.globalSpeed.toString());

    // Apply animation disable class if needed
    if (!settings.enabled || settings.reducedMotion) {
      root.classList.add("animations-disabled");
    } else {
      root.classList.remove("animations-disabled");
    }
  }, [settings, isClient]);

  const updateSettings = (newSettings: Partial<AnimationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setGlobalSpeed = (speed: number) => {
    setSettings((prev) => ({
      ...prev,
      globalSpeed: Math.max(0.1, Math.min(5, speed)),
    }));
  };

  const enableAnimations = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, enabled }));
  };

  const getDuration = (type: keyof AnimationSettings["duration"]): number => {
    if (!settings.enabled || settings.reducedMotion) return 0;
    return Math.round(settings.duration[type] * settings.globalSpeed);
  };

  const getEasing = (type: keyof AnimationSettings["easing"]): string => {
    if (!settings.enabled || settings.reducedMotion) return "linear";
    return settings.easing[type];
  };

  const getDelay = (type: keyof AnimationSettings["delays"]): number => {
    if (!settings.enabled || settings.reducedMotion) return 0;
    return Math.round(settings.delays[type] * settings.globalSpeed);
  };

  const createTransition = (
    property: string,
    duration: keyof AnimationSettings["duration"] = "normal",
    easing: keyof AnimationSettings["easing"] = "easeInOut",
    delay: keyof AnimationSettings["delays"] = "none",
  ): string => {
    if (!settings.enabled || settings.reducedMotion) return "none";

    const durationMs = getDuration(duration);
    const easingValue = getEasing(easing);
    const delayMs = getDelay(delay);

    return `${property} ${durationMs}ms ${easingValue} ${delayMs}ms`;
  };

  const isAnimationEnabled = (): boolean => {
    return settings.enabled && !settings.reducedMotion;
  };

  const value: AnimationContextType = {
    settings,
    updateSettings,
    setGlobalSpeed,
    enableAnimations,
    getDuration,
    getEasing,
    getDelay,
    createTransition,
    isAnimationEnabled,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}

      {/* Static Animation Styles - Client Side Only */}
      {isClient && (
        <style suppressHydrationWarning>
          {`
            /* Animation CSS Variables */
            :root {
              /* Standard durations */
              --duration-fast: 150ms;
              --duration-normal: 300ms;
              --duration-slow: 500ms;
              --duration-ultra: 1000ms;
              
              /* Standard easings */
              --easing-linear: linear;
              --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
              --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
              --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
              --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
              --easing-elastic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
              --easing-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
              --easing-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
              
              /* Standard delays */
              --delay-none: 0ms;
              --delay-short: 100ms;
              --delay-medium: 200ms;
              --delay-long: 500ms;
            }

            /* Professional animation classes */
            .animate-fade-in {
              animation: fadeIn var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-up {
              animation: slideUp var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-down {
              animation: slideDown var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-left {
              animation: slideLeft var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-right {
              animation: slideRight var(--duration-normal) var(--easing-ease-out);
            }

            .animate-scale-in {
              animation: scaleIn var(--duration-normal) var(--easing-bounce);
            }

            .animate-rotate-in {
              animation: rotateIn var(--duration-slow) var(--easing-elastic);
            }

            .animate-bounce {
              animation: bounce var(--duration-ultra) var(--easing-bounce) infinite;
            }

            .animate-pulse {
              animation: pulse var(--duration-slow) var(--easing-ease-in-out) infinite;
            }

            .animate-float {
              animation: float var(--duration-ultra) var(--easing-ease-in-out) infinite;
            }

            /* Stagger animations */
            .stagger-children > *:nth-child(1) { animation-delay: calc(var(--delay-short) * 0); }
            .stagger-children > *:nth-child(2) { animation-delay: calc(var(--delay-short) * 1); }
            .stagger-children > *:nth-child(3) { animation-delay: calc(var(--delay-short) * 2); }
            .stagger-children > *:nth-child(4) { animation-delay: calc(var(--delay-short) * 3); }
            .stagger-children > *:nth-child(5) { animation-delay: calc(var(--delay-short) * 4); }
            .stagger-children > *:nth-child(n+6) { animation-delay: calc(var(--delay-short) * 5); }

            /* Hover animations */
            .hover-lift {
              transition: transform var(--duration-fast) var(--easing-ease-out);
            }

            .hover-lift:hover {
              transform: translateY(-4px);
            }

            .hover-scale {
              transition: transform var(--duration-fast) var(--easing-ease-out);
            }

            .hover-scale:hover {
              transform: scale(1.05);
            }

            .hover-glow {
              transition: box-shadow var(--duration-normal) var(--easing-ease-out);
            }

            .hover-glow:hover {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
            }

            /* Keyframe definitions */
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes slideUp {
              from { 
                opacity: 0; 
                transform: translateY(20px); 
              }
              to { 
                opacity: 1; 
                transform: translateY(0); 
              }
            }

            @keyframes slideDown {
              from { 
                opacity: 0; 
                transform: translateY(-20px); 
              }
              to { 
                opacity: 1; 
                transform: translateY(0); 
              }
            }

            @keyframes slideLeft {
              from { 
                opacity: 0; 
                transform: translateX(20px); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0); 
              }
            }

            @keyframes slideRight {
              from { 
                opacity: 0; 
                transform: translateX(-20px); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0); 
              }
            }

            @keyframes scaleIn {
              from { 
                opacity: 0; 
                transform: scale(0.8); 
              }
              to { 
                opacity: 1; 
                transform: scale(1); 
              }
            }

            @keyframes rotateIn {
              from { 
                opacity: 0; 
                transform: rotate(-180deg) scale(0.5); 
              }
              to { 
                opacity: 1; 
                transform: rotate(0deg) scale(1); 
              }
            }

            @keyframes bounce {
              0%, 20%, 53%, 80%, 100% {
                transform: translateY(0);
              }
              40%, 43% {
                transform: translateY(-10px);
              }
              70% {
                transform: translateY(-5px);
              }
              90% {
                transform: translateY(-2px);
              }
            }

            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-6px);
              }
            }

            /* Disable animations when needed */
            .animations-disabled,
            .animations-disabled *,
            .animations-disabled *:before,
            .animations-disabled *:after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              transition-delay: 0.01ms !important;
            }

            /* Accessibility: Respect user preferences */
            @media (prefers-reduced-motion: reduce) {
              *,
              *:before,
              *:after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                transition-delay: 0.01ms !important;
                scroll-behavior: auto !important;
              }
            }

            /* Performance optimizations */
            .animate-fade-in,
            .animate-slide-up,
            .animate-slide-down,
            .animate-slide-left,
            .animate-slide-right,
            .animate-scale-in,
            .animate-rotate-in {
              will-change: transform, opacity;
            }

            .hover-lift,
            .hover-scale {
              will-change: transform;
            }

            .hover-glow {
              will-change: box-shadow;
            }

            /* Print styles - disable animations */
            @media print {
              *,
              *:before,
              *:after {
                animation: none !important;
                transition: none !important;
              }
            }
          `}
        </style>
      )}
    </AnimationContext.Provider>
  );
}

export const useAnimation = () => {
  const context = useContext(AnimationContext);

  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationController");
  }

  return context;
};
