'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTranslation } from '../hooks/useTranslation';
import { useColorPalette } from '../hooks/useColorPalette';
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
  Calendar
} from 'lucide-react';

interface HeroStats {
  number: string;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
}

interface TechBadge {
  name: string;
  icon: string;
  color: string;
}

export default function ModernHero() {
  const { t, currentLanguage } = useTranslation();
  const { activePalette } = useColorPalette();
  const [currentStats, setCurrentStats] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isArabic = currentLanguage === 'ar';

  const heroStats: HeroStats[] = [
    {
      number: '2500+',
      label: 'Happy Customers',
      labelAr: 'عميل سعيد',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      number: '98%',
      label: 'Satisfaction Rate',
      labelAr: 'معدل الرضا',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      number: '6+',
      label: 'Years Experience',
      labelAr: 'سنوات خبرة',
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      number: '24/7',
      label: 'Available Service',
      labelAr: 'خدمة متاحة',
      icon: Zap,
      color: 'text-green-500'
    }
  ];

  const techBadges: TechBadge[] = [
    { name: 'ISO 9001', icon: '🏆', color: 'bg-blue-100 text-blue-800' },
    { name: 'Eco-Friendly', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { name: 'Certified', icon: '✅', color: 'bg-purple-100 text-purple-800' },
    { name: 'Insured', icon: '🛡️', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStats(prev => (prev + 1) % heroStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoPlay = () => {
    // Video modal logic would go here
    console.log('Play video');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-green-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-green-950/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-12">
          {/* Content Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-in' : 'opacity-0'}`}>
            {/* Badge with Animation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {techBadges.map((badge, index) => (
                <Badge 
                  key={badge.name}
                  className={`${badge.color} animate-in slide-in-from-left-5`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>

            {/* Main Heading with Gradient Text */}
            <div className="space-y-4">
              <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black leading-tight ${
                isArabic ? 'text-right' : 'text-left'
              }`}>
                <span className="block text-gray-900 dark:text-white mb-2">
                  {isArabic ? 'عالم النظافة' : 'Cleaning'}
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent animate-gradient-x">
                  {isArabic ? 'المحترف' : 'Excellence'}
                </span>
                <span className="block text-gray-700 dark:text-gray-300 text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
                  {isArabic ? 'بأحدث التقنيات' : 'Redefined'}
                </span>
              </h1>

              <p className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed ${
                isArabic ? 'text-right' : 'text-left'
              }`}>
                {isArabic 
                  ? 'خدمات تنظيف احترافية باستخدام أحدث المعدات الأمريكية والأوروبية مع ضمان الجودة والتميز'
                  : 'Professional cleaning services using the latest American and European equipment with quality guarantee and excellence'
                }
              </p>
            </div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = index === currentStats;
                return (
                  <div 
                    key={index}
                    className={`text-center p-4 rounded-2xl transition-all duration-500 transform ${
                      isActive 
                        ? 'bg-white/80 dark:bg-gray-800/80 shadow-lg scale-105 backdrop-blur-sm' 
                        : 'bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} ${isActive ? 'animate-bounce' : ''}`} />
                    <div className={`text-2xl font-bold text-gray-900 dark:text-white ${isActive ? 'animate-pulse' : ''}`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isArabic ? stat.labelAr : stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                asChild 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Link href="/admin">
                  <Calendar className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  {isArabic ? 'احجز الآن' : 'Book Now'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="group border-2 border-gray-300 hover:border-blue-500 bg-white/80 backdrop-blur-sm hover:bg-blue-50 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                onClick={handleVideoPlay}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {isArabic ? 'شاهد الفيديو' : 'Watch Video'}
              </Button>

              <Button 
                variant="ghost" 
                size="lg" 
                className="group text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <a href="tel:+966501234567">
                  <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {isArabic ? 'اتصل الآن' : 'Call Now'}
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? 'ضمان 100%' : '100% Guarantee'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? 'تأمين شامل' : 'Fully Insured'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isArabic ? 'خدمة 24/7' : '24/7 Service'}
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative group">
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 animate-float z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isArabic ? 'تقييم العملاء' : 'Customer Rating'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 animate-float animation-delay-1000 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isArabic ? 'مؤمن بالكامل' : 'Fully Insured'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {isArabic ? 'حماية شاملة' : 'Complete Protection'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Hero Image */}
              <div className="relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-3xl p-8 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mx-auto">
                      <Sparkles className="w-12 h-12 text-blue-600 animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isArabic ? 'تقنية متطورة' : 'Advanced Tech'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {isArabic ? 'معدات حديثة' : 'Modern Equipment'}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-3xl transform rotate-6 scale-105 -z-10"></div>
            </div>

            {/* Quick Action Floating Button */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-xl hover:shadow-2xl animate-bounce-slow group"
                asChild
              >
                <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
