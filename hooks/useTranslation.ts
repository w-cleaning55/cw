import { useState, useEffect, useCallback } from "react";
import {
  t,
  getCurrentLanguage,
  setLanguage as setHelperLanguage,
  initializeTranslations,
} from "../utils/translationHelper";

export type SupportedLanguage = "ar" | "en";

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    () => {
      if (typeof window === "undefined") return "ar";
      return (getCurrentLanguage() as SupportedLanguage) || "ar";
    },
  );
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const initTranslations = async () => {
      try {
        await initializeTranslations(currentLanguage);
        setInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.warn("Translation initialization failed:", error);
        setInitialized(true);
        setIsLoading(false);
      }
    };

    initTranslations();
  }, [currentLanguage, initialized]);

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      if (language === currentLanguage) return;

      setIsLoading(true);
      setInitialized(false);
      try {
        await setHelperLanguage(language);
        setCurrentLanguage(language);
      } catch (error) {
        console.warn("Language change failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage],
  );

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return t(key, params);
    },
    [currentLanguage],
  );

  return {
    t: translate,
    currentLanguage,
    changeLanguage,
    switchLanguage: changeLanguage,
    isLoading,
    isRTL: currentLanguage === "ar",
  };
}

export function useTranslationKeys() {
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  useEffect(() => {
    // In development, we could track missing keys
    // For now, return empty array
    const interval = setInterval(() => {
      // This would need to be implemented in the translation helper
      // if we want to track missing keys
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearMissingKeys = useCallback(() => {
    setMissingKeys([]);
  }, []);

  return {
    missingKeys,
    clearMissingKeys,
  };
}
