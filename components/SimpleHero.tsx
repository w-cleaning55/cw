"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import {
  ArrowRight,
  Star,
  Shield,
  Zap,
  Heart,
  Play,
  CheckCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
} from "lucide-react";

export default function SimpleHero() {
  const { t, currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";

  const techBadges = [
    { name: "ISO 9001", icon: "🏆", color: "bg-blue-100 text-blue-800" },
    { name: "Eco-Friendly", icon: "🌱", color: "bg-green-100 text-green-800" },
    { name: "Certified", icon: "✅", color: "bg-purple-100 text-purple-800" },
    { name: "Insured", icon: "🛡️", color: "bg-orange-100 text-orange-800" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-green-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-green-950/20">
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-12">
          {/* Content Side */}
          <div className="space-y-8">
            {/* Badge with Animation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {techBadges.map((badge, index) => (
                <Badge key={badge.name} className={badge.color}>
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1
                className={`text-4xl sm:text-5xl lg:text-7xl font-black leading-tight ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <span className="block text-gray-900 dark:text-white mb-2">
                  {isArabic ? "عالم النظافة جدة" : "Cleaning"}
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                  {isArabic ? "المتميز" : "Excellence"}
                </span>
                <span className="block text-gray-700 dark:text-gray-300 text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
                  {isArabic ? "بأحدث التقنيات العالمية" : "Redefined"}
                </span>
              </h1>

              <p
                className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {isArabic
                  ? "شركة تنظيف محترفة في جدة، نقدم خدمات التنظيف العميق بأحدث المعدات العالمية وبخبرة تزيد عن 6 سنوات"
                  : "Professional cleaning services using the latest American and European equipment with quality guarantee and excellence"}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Link href="/admin">
                  <Calendar className="w-5 h-5 mr-2" />
                  {isArabic ? "احجز خدمتك الآن" : "Book Now"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-gray-300 hover:border-blue-500 bg-white/80 backdrop-blur-sm hover:bg-blue-50 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                {isArabic ? "شاهد أعمالنا" : "Watch Video"}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="group text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <a href="tel:+966501234567">
                  <Phone className="w-5 h-5 mr-2" />
                  {isArabic ? "اتصل الآن" : "Call Now"}
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? "ضمان شامل" : "100% Guarantee"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? "تأمين شامل" : "Fully Insured"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? "خدمة على مدار الساعة" : "24/7 Service"}
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mx-auto">
                    <Sparkles className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isArabic ? "تقنيات حديثة" : "Advanced Tech"}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {isArabic ? "معدات عالمية" : "Modern Equipment"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
