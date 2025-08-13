"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "next-themes";
import ThemeSelector from "./ThemeSelector";
import { Sun, Moon, Globe, LogIn, User, Settings, Menu } from "lucide-react";

export default function Header() {
  const { currentLanguage, switchLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const isArabic = currentLanguage === "ar";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CW</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              {isArabic ? "عالم النظافة جدة" : "Cleaning World"}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {isArabic ? "الرئيسية" : "Home"}
            </Link>
            <Link
              href="#services"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {isArabic ? "خدماتنا" : "Services"}
            </Link>
            <Link
              href="#about"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {isArabic ? "من نحن" : "About"}
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {isArabic ? "اتصل بنا" : "Contact"}
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Color Theme Selector */}
            <ThemeSelector />

            {/* Dark/Light Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => switchLanguage("ar")}
                  className={
                    currentLanguage === "ar" ? "bg-blue-50 text-blue-600" : ""
                  }
                >
                  <span className="mr-2">🇸🇦</span>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLanguage("en")}
                  className={
                    currentLanguage === "en" ? "bg-blue-50 text-blue-600" : ""
                  }
                >
                  <span className="mr-2">🇺🇸</span>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Button */}
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>{isArabic ? "دخول الإدارة" : "Login"}</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/" className="w-full">
                    {isArabic ? "الرئيسية" : "Home"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#services" className="w-full">
                    {isArabic ? "خدماتنا" : "Services"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#about" className="w-full">
                    {isArabic ? "من نحن" : "About"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#contact" className="w-full">
                    {isArabic ? "اتصل بنا" : "Contact"}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
