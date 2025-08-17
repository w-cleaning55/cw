"use client";

import React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemSettings } from "@/hooks/useSystemSettings";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const { currentLanguage } = useTranslation();
  const { settings } = useSystemSettings();

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeProvider>
        <div
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          lang={currentLanguage === "ar" ? "ar-SA" : "en-US"}
          className={`${currentLanguage === "ar" ? "font-tajawal" : "font-inter"} antialiased`}
        >
          {children}
        </div>
      </ThemeProvider>
    </NextThemeProvider>
  );
}
