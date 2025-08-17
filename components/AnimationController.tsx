"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AnimationState {
  isAnimationEnabled: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  prefersReducedMotion: boolean;
}

interface AnimationContextType extends AnimationState {
  enableAnimations: () => void;
  disableAnimations: () => void;
  setAnimationSpeed: (speed: "slow" | "normal" | "fast") => void;
  triggerAnimation: (elementId: string, animation: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

interface AnimationControllerProps {
  children: ReactNode;
}

export function AnimationController({ children }: AnimationControllerProps) {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      setIsAnimationEnabled(false);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsAnimationEnabled(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSettings = localStorage.getItem("animation-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsAnimationEnabled(settings.enabled ?? true);
        setAnimationSpeed(settings.speed ?? "normal");
      } catch (error) {
        console.warn("Failed to load animation settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const settings = {
      enabled: isAnimationEnabled,
      speed: animationSpeed,
    };

    try {
      localStorage.setItem("animation-settings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save animation settings:", error);
    }
  }, [isAnimationEnabled, animationSpeed]);

  const enableAnimations = () => {
    if (!prefersReducedMotion) {
      setIsAnimationEnabled(true);
    }
  };

  const disableAnimations = () => {
    setIsAnimationEnabled(false);
  };

  const triggerAnimation = (elementId: string, animation: string) => {
    if (!isAnimationEnabled) return;

    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(animation);

      const handleAnimationEnd = () => {
        element.classList.remove(animation);
        element.removeEventListener("animationend", handleAnimationEnd);
      };

      element.addEventListener("animationend", handleAnimationEnd);
    }
  };

  const value: AnimationContextType = {
    isAnimationEnabled,
    animationSpeed,
    prefersReducedMotion,
    enableAnimations,
    disableAnimations,
    setAnimationSpeed,
    triggerAnimation,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationController");
  }
  return context;
}

export default AnimationController;
