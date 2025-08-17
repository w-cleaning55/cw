"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";


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
  const { theme, setTheme } = useTheme();
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

  const themes: Array<{ id: "light" | "dark" | "system"; name: { ar: string; en: string }; icon: string }> = [
    { id: "light", name: { ar: "فاتح", en: "Light" }, icon: "☀️" },
    { id: "dark", name: { ar: "داكن", en: "Dark" }, icon: "🌙" },
    { id: "system", name: { ar: "تلقائي", en: "System" }, icon: "🖥️" },
  ];

  const currentThemeData = themes.find(t => t.id === theme);

  const handleThemeChange = (themeId: "light" | "dark" | "system") => {
    setTheme(themeId);
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
            {currentThemeData?.name[currentLanguage] || theme}
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
        <span className="text-lg">
          {currentThemeData?.icon || "🎨"}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {currentThemeData?.name[currentLanguage] || theme}
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
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    theme === themeOption.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {/* أيقونة الثيم */}
                  <span className="text-lg flex-shrink-0">
                    {themeOption.icon}
                  </span>
                  
                  {/* معلومات الثيم */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {themeOption.name[currentLanguage]}
                    </div>
                  </div>
                  
                  {/* علامة الاختيار */}
                  {theme === themeOption.id && (
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
