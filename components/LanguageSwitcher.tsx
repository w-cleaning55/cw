"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: "button" | "dropdown" | "compact";
}

const LANGUAGES = {
  ar: {
    name: "العربية",
    nativeName: "العربية",
    flag: "🇸🇦",
    direction: "rtl"
  },
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr"
  }
};

export default function LanguageSwitcher({ 
  className = "", 
  showLabel = false,
  variant = "dropdown" 
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = currentLanguage === "ar";

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangData = LANGUAGES[currentLanguage as keyof typeof LANGUAGES];
  const languageEntries = Object.entries(LANGUAGES);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode as "ar" | "en");
    setIsOpen(false);
  };

  if (variant === "button") {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors ${className}`}
        title={currentLanguage === "ar" ? "تغيير اللغة" : "Change Language"}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currentLangData?.nativeName}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors ${className}`}
        title={currentLanguage === "ar" ? "تغيير اللغة" : "Change Language"}
      >
        <Globe className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* زر التبديل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors border border-gray-200"
        title={currentLanguage === "ar" ? "تغيير اللغة" : "Change Language"}
      >
        <span className="text-lg">{currentLangData?.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentLangData?.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-50 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 backdrop-blur-sm`}>
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
              {currentLanguage === "ar" ? "اختر اللغة" : "Choose Language"}
            </div>
            
            <div className="space-y-1 mt-2">
              {languageEntries.map(([langCode, langData]) => (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentLanguage === langCode
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {/* العلم */}
                  <span className="text-lg flex-shrink-0">{langData.flag}</span>
                  
                  {/* معلومات اللغة */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {langData.nativeName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {langData.name} • {langData.direction.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* علامة الاختيار */}
                  {currentLanguage === langCode && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
