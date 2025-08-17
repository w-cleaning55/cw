"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";
import { THEMES } from "@/lib/theme-system";

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: "button" | "dropdown" | "compact";
}

export default function ThemeSwitcher({ 
  className = "", 
  showLabel = false,
  variant = "dropdown" 
}: ThemeSwitcherProps) {
  const { currentTheme, setCurrentTheme, themes } = useTheme();
  const { currentLanguage } = useTranslation();
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

  const currentThemeData = THEMES[currentTheme];
  const themeEntries = Object.entries(THEMES);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  if (variant === "button") {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors ${className}`}
        title={currentLanguage === "ar" ? "تغيير الثيم" : "Change Theme"}
      >
        <Palette className="w-4 h-4 text-gray-600" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currentThemeData?.name[currentLanguage] || currentTheme}
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
        title={currentLanguage === "ar" ? "تغيير الثيم" : "Change Theme"}
      >
        <Palette className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* زر التبديل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors border border-gray-200"
        title={currentLanguage === "ar" ? "تغيير الثيم" : "Change Theme"}
      >
        <div 
          className="w-4 h-4 rounded-full border-2 border-gray-300"
          style={{ 
            backgroundColor: currentThemeData?.light.primary || "#2563eb",
            borderColor: currentThemeData?.light.primary || "#2563eb"
          }}
        />
        <span className="text-sm font-medium text-gray-700">
          {currentThemeData?.name[currentLanguage] || currentTheme}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-50 min-w-64 bg-white rounded-lg shadow-lg border border-gray-200 backdrop-blur-sm`}>
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
              {currentLanguage === "ar" ? "اختر الثيم" : "Choose Theme"}
            </div>
            
            <div className="space-y-1 mt-2">
              {themeEntries.map(([themeId, theme]) => (
                <button
                  key={themeId}
                  onClick={() => handleThemeChange(themeId)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentTheme === themeId
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {/* مؤشر اللون */}
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: theme.light.primary,
                      borderColor: theme.light.primary
                    }}
                  />
                  
                  {/* معلومات الثيم */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {theme.name[currentLanguage]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {theme.description[currentLanguage]}
                    </div>
                  </div>
                  
                  {/* علامة الاختيار */}
                  {currentTheme === themeId && (
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
