"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Palette, Menu, X, Phone, MessageCircle } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompactIcons";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import QuickThemeSwitcher from "@/components/QuickThemeSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const { settings } = useSystemSettings();
  const companyName = settings?.company?.name || "عالم النظافة";
  const logo = settings?.company?.logo || settings?.theme?.logoUrl;
  const { currentLanguage, switchLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "الرئيسية", href: "#home" },
    { label: "خدماتنا", href: "#services" },
    { label: "من نحن", href: "#about" },
    { label: "اتصل بنا", href: "#contact" },
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <CompanyLogo size="lg" src={logo || undefined} />
                <h1 className="text-xl lg:text-2xl font-bold text-blue-600 hidden sm:block">
                  {companyName}
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" dir="rtl">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-900 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              لوحة الإدارة
            </Link>
          </nav>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => switchLanguage(currentLanguage === "ar" ? "en" : "ar")}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              title={currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              title={currentLanguage === "ar" ? "تغيير الثيم" : "Change Theme"}
            >
              <Palette className="w-5 h-5 text-gray-600" />
            </button>

            {/* Quick Theme Switcher */}
            <QuickThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-600 transition-colors"
                  title={currentLanguage === "ar" ? "القائمة" : "Menu"}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <CompanyLogo size="md" src={logo || undefined} />
                      <h2 className="text-lg font-bold text-blue-600">{companyName}</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4 space-y-4">
                    {navigationItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="block py-3 px-4 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                        dir="rtl"
                      >
                        {item.label}
                      </a>
                    ))}
                    
                    {/* Admin Link */}
                    <Link
                      href="/admin"
                      className="block py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
                      dir="rtl"
                    >
                      لوحة الإدارة
                    </Link>
                  </nav>

                  {/* Mobile Controls */}
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    {/* Language and Theme Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => switchLanguage(currentLanguage === "ar" ? "en" : "ar")}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        title={currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                      >
                        <Globe className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <button
                        onClick={toggleTheme}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        title={currentLanguage === "ar" ? "تغيير الثيم" : "Change Theme"}
                      >
                        <Palette className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">+966559061065</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">admin@cw.com.sa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
