"use client";

import React from "react";
import Link from "next/link";
import { CompanyLogo } from "@/components/ui/CompactIcons";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                🧽 عالم النظافة
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8" dir="rtl">
            <a
              href="#home"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="#services"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors"
            >
              خدماتنا
            </a>
            <a
              href="#about"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors"
            >
              من نحن
            </a>
            <a
              href="#contact"
              className="text-gray-900 hover:text-blue-600 font-medium transition-colors"
            >
              اتصل بنا
            </a>
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              لوحة الإدارة
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-600 transition-colors">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
