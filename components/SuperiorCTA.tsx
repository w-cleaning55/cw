'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useTranslation } from '../hooks/useTranslation';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Star,
  Shield,
  Zap,
  Gift,
  CheckCircle,
  Sparkles,
  Rocket,
  Target,
  Heart,
  TrendingUp,
  Timer,
  Award,
  Users,
  MapPin
} from 'lucide-react';

interface CTAOffer {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  discount: string;
  discountAr: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  isLimited: boolean;
  timeLeft?: string;
}

interface QuickStat {
  value: string;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
}

export default function SuperiorCTA() {
  const { t, currentLanguage } = useTranslation();
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [isInView, setIsInView] = useState(false);
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isArabic = currentLanguage === 'ar';

  const offers: CTAOffer[] = [
    {
      id: 'first-time',
      title: 'First Time Customer',
      titleAr: 'عميل لأول مرة',
      description: 'Get 30% off your first deep cleaning service',
      descriptionAr: 'احصل على خصم 30% على أول خدمة تنظيف عميق',
      discount: '30% OFF',
      discountAr: 'خصم 30%',
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      isLimited: true,
      timeLeft: '24:00:00'
    },
    {
      id: 'premium',
      title: 'Premium Package',
      titleAr: 'الباقة المميزة',
      description: 'Complete home cleaning with 6-month warranty',
      descriptionAr: 'تنظيف منزل شامل مع ضمان 6 أشهر',
      discount: 'FREE Warranty',
      discountAr: 'ضمان مجاني',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      isLimited: false
    },
    {
      id: 'urgent',
      title: 'Same Day Service',
      titleAr: 'خدمة نفس اليوم',
      description: 'Emergency cleaning available within 2 hours',
      descriptionAr: 'تنظيف طارئ متاح خلال ساعتين',
      discount: 'Fast Response',
      discountAr: 'استجابة سريعة',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      isLimited: true,
      timeLeft: '02:00:00'
    }
  ];

  const quickStats: QuickStat[] = [
    {
      value: '2500+',
      label: 'Happy Customers',
      labelAr: 'عميل سعيد',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      value: '15min',
      label: 'Response Time',
      labelAr: 'وقت الاستجابة',
      icon: Timer,
      color: 'text-green-600'
    },
    {
      value: '98%',
      label: 'Satisfaction Rate',
      labelAr: 'معدل الرضا',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      value: '24/7',
      label: 'Available',
      labelAr: 'متاح',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  useEffect(() => {
    // Set client-side flag and generate particles only on client
    setIsClient(true);
    setParticles([...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    })));

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return 24 * 60 * 60; // Reset to 24 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-rotate offers
    const interval = setInterval(() => {
      setSelectedOffer(prev => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuickCall = () => {
    window.open('tel:+966501234567', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/966501234567?text=Hello! I would like to book a cleaning service.', '_blank');
  };

  const handleQuickQuote = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setPhoneNumber('');
    // Show success message
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900">
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Animated particles */}
        <div className="absolute inset-0">
          {isClient && particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/30 via-transparent to-green-600/30 animate-gradient-x"></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Main CTA Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className={`text-white space-y-8 ${isInView ? 'animate-in' : 'opacity-0'}`}>
              {/* Urgent Badge */}
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  {isArabic ? 'عرض محدود ا��وقت' : 'Limited Time Offer'}
                </Badge>
                <div className="text-2xl font-bold text-red-400" suppressHydrationWarning>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                  {isArabic ? (
                    <>
                      <span className="block">احصل على منزل</span>
                      <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        نظيف ومتألق
                      </span>
                      <span className="block text-3xl md:text-4xl">في دقائق!</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Get Your Home</span>
                      <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Spotless & Sparkling
                      </span>
                      <span className="block text-3xl md:text-4xl">In Minutes!</span>
                    </>
                  )}
                </h2>

                <p className="text-xl text-gray-300 leading-relaxed">
                  {isArabic 
                    ? 'خدمة تنظيف فورية بأحدث التقنيات الأوروبية والأمريكية. احجز الآن واحصل على خصم حصري!'
                    : 'Instant cleaning service with the latest European and American technology. Book now and get an exclusive discount!'
                  }
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index}
                      className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-300">
                        {isArabic ? stat.labelAr : stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {isArabic ? 'ضمان 100%' : '100% Guarantee'}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Shield className="w-5 h-5 text-blue-400" />
                  {isArabic ? 'مؤمن بالكامل' : 'Fully Insured'}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Award className="w-5 h-5 text-yellow-400" />
                  {isArabic ? 'معتمد ISO' : 'ISO Certified'}
                </div>
              </div>
            </div>

            {/* Right Side - Action Panel */}
            <div className={`${isInView ? 'animate-in animation-delay-1000' : 'opacity-0'}`}>
              <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  {/* Offer Tabs */}
                  <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    {offers.map((offer, index) => {
                      const Icon = offer.icon;
                      return (
                        <button
                          key={offer.id}
                          onClick={() => setSelectedOffer(index)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all text-sm font-semibold ${
                            selectedOffer === index
                              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {isArabic ? offer.titleAr : offer.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Offer */}
                  <div className={`mb-8 p-6 rounded-2xl ${offers[selectedOffer].bgColor} border-2 border-dashed border-current transition-all duration-500`}>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${offers[selectedOffer].color} bg-white text-lg px-3 py-1`}>
                        {isArabic ? offers[selectedOffer].discountAr : offers[selectedOffer].discount}
                      </Badge>
                      {offers[selectedOffer].isLimited && (
                        <div className="flex items-center gap-1 text-sm text-red-600 font-semibold">
                          <Timer className="w-4 h-4" />
                          {isArabic ? 'ينتهي قريباً' : 'Ending Soon'}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {isArabic ? offers[selectedOffer].titleAr : offers[selectedOffer].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isArabic ? offers[selectedOffer].descriptionAr : offers[selectedOffer].description}
                    </p>
                  </div>

                  {/* Quick Quote Form */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {isArabic ? 'احصل على عرض سعر فوري' : 'Get Instant Quote'}
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        placeholder={isArabic ? 'رقم الجوال' : 'Phone Number'}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      />
                      <Button 
                        onClick={handleQuickQuote}
                        disabled={isSubmitting || !phoneNumber.trim()}
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-6"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            {isArabic ? 'إرسال' : 'Send'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleQuickCall}
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      <Phone className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                      {isArabic ? 'اتصل الآن - خدمة فورية' : 'Call Now - Instant Service'}
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button 
                      onClick={handleWhatsApp}
                      size="lg" 
                      variant="outline"
                      className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-300 group"
                    >
                      <MessageCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      {isArabic ? 'واتساب - رد فوري' : 'WhatsApp - Instant Reply'}
                    </Button>

                    <Button 
                      size="lg" 
                      variant="ghost"
                      className="w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 group"
                      asChild
                    >
                      <a href="/admin">
                        <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        {isArabic ? 'احجز موعد مناسب' : 'Schedule Convenient Time'}
                      </a>
                    </Button>
                  </div>

                  {/* Location Indicator */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {isArabic ? 'نخدم جميع أنحاء المملكة العربية السعودية' : 'Serving All Saudi Arabia'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className={`mt-16 ${isInView ? 'animate-in animation-delay-2000' : 'opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-semibold">
                  {isArabic ? '+50 طلب يومياً' : '50+ Daily Bookings'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">
                  {isArabic ? '4.9 تقييم العملاء' : '4.9 Customer Rating'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="font-semibold">
                  {isArabic ? '2500+ عميل سعيد' : '2500+ Happy Customers'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">
                  {isArabic ? 'تقنية متطورة' : 'Advanced Technology'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
