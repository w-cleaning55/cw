"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColors, useThemeClasses } from "@/hooks/useTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Users,
  Award,
  Zap,
  Shield,
  Heart,
  Sparkles,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Service {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  shortDescription?: { ar: string; en: string };
  price?: {
    min: number;
    max?: number;
    currency: string;
    unit?: { ar: string; en: string };
  };
  duration?: { ar: string; en: string };
  image?: string;
  icon?: string;
  rating?: number;
  reviewCount?: number;
  features?: Array<{ ar: string; en: string }>;
  benefits?: Array<{ ar: string; en: string }>;
  category?: string;
  popular?: boolean;
  featured?: boolean;
  new?: boolean;
  discount?: {
    percentage: number;
    validUntil?: string;
  };
  availability?: "available" | "busy" | "unavailable";
  bookingCount?: number;
  gallery?: string[];
}

interface ServicesOverviewProps {
  data: {
    style?: "grid" | "carousel" | "masonry" | "list" | "cards" | "minimal";
    title?: { ar: string; en: string };
    subtitle?: { ar: string; en: string };
    description?: { ar: string; en: string };
    showCount?: number;
    showAll?: boolean;
    viewAllButton?: { ar: string; en: string };
    showPrices?: boolean;
    showRatings?: boolean;
    showDuration?: boolean;
    showFeatures?: boolean;
    showBookingButton?: boolean;
    enableFilters?: boolean;
    categories?: Array<{
      id: string;
      name: { ar: string; en: string };
    }>;
    sortOptions?: Array<{
      id: string;
      name: { ar: string; en: string };
      field: string;
    }>;
  };
  settings?: any;
  sectionSettings?: any;
  isVisible?: boolean;
  isPreview?: boolean;
}

export default function DynamicServicesOverview({
  data,
  settings,
  sectionSettings,
  isVisible = true,
  isPreview = false,
}: ServicesOverviewProps) {
  const { t, isArabic } = useTranslation();
  const { colors } = useThemeColors();
  const themeClasses = useThemeClasses();

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const serviceStyle = data.style || "grid";
  const showCount = data.showCount || 6;

  // تحميل الخدمات
  useEffect(() => {
    loadServices();
  }, []);

  // تطبيق الفلاتر والترتيب
  useEffect(() => {
    let filtered = [...services];

    // تطبيق فلتر الفئة
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory,
      );
    }

    // تطبيق الترتيب
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.price?.min || 0) - (b.price?.min || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price?.min || 0) - (a.price?.min || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
    }

    // تحديد العدد المعروض
    if (!data.showAll) {
      filtered = filtered.slice(0, showCount);
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, sortBy, showCount, data.showAll]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      const data = await response.json();

      if (data.success) {
        setServices(data.services || getDefaultServices());
      } else {
        setServices(getDefaultServices());
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  // الخدمات الافتراضية
  const getDefaultServices = (): Service[] => [
    {
      id: "carpet-cleaning",
      title: { ar: "تنظيف السجاد والستائر", en: "Carpet & Curtain Cleaning" },
      description: {
        ar: "تنظيف عميق للسجاد والستائر بأحدث التقنيات الأوروبية",
        en: "Deep cleaning for carpets and curtains with latest European technology",
      },
      shortDescription: {
        ar: "تنظيف احترافي للسجاد",
        en: "Professional carpet cleaning",
      },
      price: {
        min: 50,
        max: 200,
        currency: "SAR",
        unit: { ar: "لكل متر مربع", en: "per square meter" },
      },
      duration: { ar: "2-4 ساعات", en: "2-4 hours" },
      image: "/images/services/carpet-cleaning.svg",
      icon: "Home",
      rating: 4.9,
      reviewCount: 156,
      features: [
        { ar: "تنظيف بالبخار", en: "Steam cleaning" },
        { ar: "مواد صديقة للبيئة", en: "Eco-friendly materials" },
        { ar: "ضمان لمدة شهر", en: "1 month warranty" },
      ],
      category: "residential",
      popular: true,
      featured: true,
      availability: "available",
      bookingCount: 89,
    },
    {
      id: "marble-polishing",
      title: { ar: "جلي وتلميع الرخام", en: "Marble Polishing" },
      description: {
        ar: "جلي وتلميع الرخام والأرضيات بالماس الأمريكي",
        en: "Marble and floor polishing with American diamond technology",
      },
      shortDescription: {
        ar: "جلي الرخام الاحترافي",
        en: "Professional marble polishing",
      },
      price: {
        min: 80,
        max: 150,
        currency: "SAR",
        unit: { ar: "لكل متر مربع", en: "per square meter" },
      },
      duration: { ar: "3-6 ساعات", en: "3-6 hours" },
      image: "/images/services/marble-polishing.svg",
      icon: "Gem",
      rating: 4.8,
      reviewCount: 134,
      features: [
        { ar: "ماكينات أمريكية", en: "American machines" },
        { ar: "ضمان لمدة 6 أشهر", en: "6 months warranty" },
        { ar: "مواد عالية الجودة", en: "High-quality materials" },
      ],
      category: "residential",
      featured: true,
      availability: "available",
      bookingCount: 67,
    },
    {
      id: "deep-cleaning",
      title: { ar: "التنظيف العميق للمنازل", en: "Deep House Cleaning" },
      description: {
        ar: "تنظيف شامل وعميق لجميع أجزاء المنزل",
        en: "Comprehensive deep cleaning for all parts of the house",
      },
      shortDescription: {
        ar: "تنظيف شامل للمنزل",
        en: "Complete house cleaning",
      },
      price: {
        min: 300,
        max: 800,
        currency: "SAR",
        unit: { ar: "للزيارة", en: "per visit" },
      },
      duration: { ar: "4-8 ساعات", en: "4-8 hours" },
      image: "/images/services/deep-cleaning.svg",
      icon: "Sparkles",
      rating: 4.9,
      reviewCount: 203,
      features: [
        { ar: "تنظيف شامل", en: "Complete cleaning" },
        { ar: "فريق متخصص", en: "Specialized team" },
        { ar: "ضمان الجودة", en: "Quality guarantee" },
      ],
      category: "residential",
      popular: true,
      new: true,
      availability: "available",
      bookingCount: 134,
    },
    {
      id: "office-cleaning",
      title: { ar: "تنظيف المكاتب", en: "Office Cleaning" },
      description: {
        ar: "خدمات تنظيف مهنية للمكاتب والمنشآت التجارية",
        en: "Professional cleaning services for offices and commercial facilities",
      },
      shortDescription: {
        ar: "تنظيف مهني للمكاتب",
        en: "Professional office cleaning",
      },
      price: {
        min: 200,
        max: 500,
        currency: "SAR",
        unit: { ar: "شهرياً", en: "monthly" },
      },
      duration: { ar: "2-4 ساعات", en: "2-4 hours" },
      image: "/images/services/office-cleaning.svg",
      icon: "Building",
      rating: 4.7,
      reviewCount: 89,
      features: [
        { ar: "خدمة دورية", en: "Regular service" },
        { ar: "عمالة مدربة", en: "Trained staff" },
        { ar: "أوقات مرنة", en: "Flexible times" },
      ],
      category: "commercial",
      availability: "available",
      bookingCount: 45,
    },
    {
      id: "water-tank-cleaning",
      title: { ar: "تنظيف خزانات المياه", en: "Water Tank Cleaning" },
      description: {
        ar: "تنظيف وتعقيم خزانات المياه بأحدث التقنيات",
        en: "Cleaning and sterilizing water tanks with latest technology",
      },
      shortDescription: {
        ar: "تنظيف خزانات المياه",
        en: "Water tank cleaning",
      },
      price: {
        min: 150,
        max: 400,
        currency: "SAR",
        unit: { ar: "للخزان", en: "per tank" },
      },
      duration: { ar: "3-5 ساعات", en: "3-5 hours" },
      image: "/images/services/water-tank.svg",
      icon: "Droplets",
      rating: 4.8,
      reviewCount: 78,
      features: [
        { ar: "تعقيم شامل", en: "Complete sterilization" },
        { ar: "مواد آمنة", en: "Safe materials" },
        { ar: "شهادة صحية", en: "Health certificate" },
      ],
      category: "specialized",
      availability: "available",
      bookingCount: 23,
    },
    {
      id: "pest-control",
      title: { ar: "مكافحة الحشرات", en: "Pest Control" },
      description: {
        ar: "مكافحة فعالة وآمنة للحشرات والقوارض",
        en: "Effective and safe pest and rodent control",
      },
      shortDescription: { ar: "مكافحة الحشرات", en: "Pest control" },
      price: {
        min: 100,
        max: 300,
        currency: "SAR",
        unit: { ar: "للزيارة", en: "per visit" },
      },
      duration: { ar: "1-2 ساعة", en: "1-2 hours" },
      image: "/images/services/pest-control.svg",
      icon: "Bug",
      rating: 4.6,
      reviewCount: 112,
      features: [
        { ar: "مواد آمنة", en: "Safe materials" },
        { ar: "ضمان 3 أشهر", en: "3 months warranty" },
        { ar: "متابعة دورية", en: "Regular follow-up" },
      ],
      category: "specialized",
      discount: { percentage: 20, validUntil: "2024-12-31" },
      availability: "available",
      bookingCount: 56,
    },
  ];

  // شكل الشبكة الكلاسيكي
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${themeClasses.rounded.lg} border-0`}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          {/* صورة الخدمة */}
          <div className="relative overflow-hidden rounded-t-lg h-48">
            <img
              src={service.image || "/placeholder.svg"}
              alt={service.title[isArabic ? "ar" : "en"]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* شارات */}
            <div className="absolute top-3 right-3 flex gap-2">
              {service.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {isArabic ? "مميز" : "Featured"}
                </Badge>
              )}
              {service.new && (
                <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {isArabic ? "جديد" : "New"}
                </Badge>
              )}
              {service.popular && (
                <Badge className="bg-gradient-to-r from-pink-400 to-red-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {isArabic ? "شائع" : "Popular"}
                </Badge>
              )}
            </div>

            {/* خصم */}
            {service.discount && (
              <div className="absolute top-3 left-3">
                <Badge variant="destructive" className="bg-red-500">
                  -{service.discount.percentage}%
                </Badge>
              </div>
            )}

            {/* حالة التوفر */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant={
                  service.availability === "available" ? "default" : "secondary"
                }
                className={
                  service.availability === "available"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }
              >
                {service.availability === "available"
                  ? isArabic
                    ? "متاح"
                    : "Available"
                  : service.availability === "busy"
                    ? isArabic
                      ? "مشغول"
                      : "Busy"
                    : isArabic
                      ? "غير متاح"
                      : "Unavailable"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* العنوان والوصف */}
            <div className="mb-4">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {service.title[isArabic ? "ar" : "en"]}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                {service.shortDescription?.[isArabic ? "ar" : "en"] ||
                  service.description[isArabic ? "ar" : "en"]}
              </p>
            </div>

            {/* التقييم والمدة */}
            <div className="flex items-center justify-between mb-4">
              {data.showRatings && service.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{service.rating}</span>
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    ({service.reviewCount})
                  </span>
                </div>
              )}

              {data.showDuration && service.duration && (
                <div
                  className="flex items-center gap-1"
                  style={{ color: colors.textSecondary }}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {service.duration[isArabic ? "ar" : "en"]}
                  </span>
                </div>
              )}
            </div>

            {/* المميزات */}
            {data.showFeatures &&
              service.features &&
              service.features.length > 0 && (
                <div className="mb-4">
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span style={{ color: colors.textSecondary }}>
                          {feature[isArabic ? "ar" : "en"]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* السعر والأزرار */}
            <div className="flex items-center justify-between">
              {data.showPrices && service.price && (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {service.price.min}
                    </span>
                    {service.price.max && (
                      <>
                        <span style={{ color: colors.textSecondary }}>-</span>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          {service.price.max}
                        </span>
                      </>
                    )}
                    <span
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {service.price.currency}
                    </span>
                  </div>
                  {service.price.unit && (
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      {service.price.unit[isArabic ? "ar" : "en"]}
                    </p>
                  )}
                </div>
              )}

              {data.showBookingButton && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r hover:shadow-md transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    color: "white",
                  }}
                >
                  {isArabic ? "احجز الآن" : "Book Now"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // شكل الكاروسيل
  const renderCarouselLayout = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${-currentSlide * 100}%)` }}
        >
          {filteredServices.map((service) => (
            <div key={service.id} className="w-full flex-shrink-0 px-4">
              <Card className="h-full">
                <div className="grid md:grid-cols-2 gap-6 h-full">
                  {/* صورة الخدمة */}
                  <div className="relative h-64 md:h-full">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title[isArabic ? "ar" : "en"]}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {service.featured && (
                      <Badge className="absolute top-4 right-4 bg-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        {isArabic ? "مميز" : "Featured"}
                      </Badge>
                    )}
                  </div>

                  {/* محتوى الخدمة */}
                  <div className="p-6 flex flex-col justify-center">
                    <h3
                      className="text-3xl font-bold mb-4"
                      style={{ color: colors.text }}
                    >
                      {service.title[isArabic ? "ar" : "en"]}
                    </h3>
                    <p
                      className="text-lg mb-6"
                      style={{ color: colors.textSecondary }}
                    >
                      {service.description[isArabic ? "ar" : "en"]}
                    </p>

                    {/* المميزات */}
                    {service.features && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span style={{ color: colors.textSecondary }}>
                              {feature[isArabic ? "ar" : "en"]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center justify-between">
                      {service.price && (
                        <div>
                          <span
                            className="text-3xl font-bold"
                            style={{ color: colors.primary }}
                          >
                            {service.price.min} {service.price.currency}
                          </span>
                          {service.price.unit && (
                            <p
                              className="text-sm"
                              style={{ color: colors.textSecondary }}
                            >
                              {service.price.unit[isArabic ? "ar" : "en"]}
                            </p>
                          )}
                        </div>
                      )}

                      <Button size="lg" className="bg-gradient-to-r">
                        {isArabic ? "احجز الآن" : "Book Now"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
        onClick={() =>
          setCurrentSlide(
            Math.min(filteredServices.length - 1, currentSlide + 1),
          )
        }
        disabled={currentSlide === filteredServices.length - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* مؤشرات */}
      <div className="flex justify-center mt-6 gap-2">
        {filteredServices.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );

  // شكل القائمة
  const renderListLayout = () => (
    <div className="space-y-4">
      {filteredServices.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <div className="flex">
            {/* صورة الخدمة */}
            <div className="w-48 h-32 flex-shrink-0">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title[isArabic ? "ar" : "en"]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* محتوى الخدمة */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: colors.text }}
                    >
                      {service.title[isArabic ? "ar" : "en"]}
                    </h3>
                    {service.featured && (
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        {isArabic ? "مميز" : "Featured"}
                      </Badge>
                    )}
                  </div>

                  <p className="mb-3" style={{ color: colors.textSecondary }}>
                    {service.description[isArabic ? "ar" : "en"]}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    {service.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{service.rating}</span>
                        <span style={{ color: colors.textSecondary }}>
                          ({service.reviewCount})
                        </span>
                      </div>
                    )}

                    {service.duration && (
                      <div
                        className="flex items-center gap-1"
                        style={{ color: colors.textSecondary }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{service.duration[isArabic ? "ar" : "en"]}</span>
                      </div>
                    )}

                    {service.bookingCount && (
                      <div
                        className="flex items-center gap-1"
                        style={{ color: colors.textSecondary }}
                      >
                        <Users className="w-4 h-4" />
                        <span>
                          {service.bookingCount} {isArabic ? "حجز" : "bookings"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {service.price && (
                    <div className="mb-3">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        {service.price.min} {service.price.currency}
                      </span>
                      {service.price.unit && (
                        <p
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {service.price.unit[isArabic ? "ar" : "en"]}
                        </p>
                      )}
                    </div>
                  )}

                  <Button>
                    {isArabic ? "احجز الآن" : "Book Now"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // شكل المازونري
  const renderMasonryLayout = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className="break-inside-avoid mb-6 overflow-hidden"
        >
          <div className="relative">
            <img
              src={service.image || "/placeholder.svg"}
              alt={service.title[isArabic ? "ar" : "en"]}
              className="w-full h-48 object-cover"
            />
            {service.featured && (
              <Badge className="absolute top-3 right-3 bg-yellow-500">
                <Star className="w-3 h-3 mr-1" />
                {isArabic ? "مميز" : "Featured"}
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-bold mb-2" style={{ color: colors.text }}>
              {service.title[isArabic ? "ar" : "en"]}
            </h3>

            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              {service.description[isArabic ? "ar" : "en"]}
            </p>

            {service.features && (
              <ul className="space-y-1 mb-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span style={{ color: colors.textSecondary }}>
                      {feature[isArabic ? "ar" : "en"]}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {service.price && (
              <div className="text-center mb-3">
                <span
                  className="text-xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {service.price.min} {service.price.currency}
                </span>
              </div>
            )}

            <Button className="w-full">
              {isArabic ? "احجز الآن" : "Book Now"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // شكل البطاقات الحديثة
  const renderCardsLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className="group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
        >
          <div className="relative">
            <div className="h-56 overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title[isArabic ? "ar" : "en"]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* شارات متقدمة */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {service.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                  <Award className="w-3 h-3 mr-1" />
                  {isArabic ? "مميز" : "Featured"}
                </Badge>
              )}
              {service.popular && (
                <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 shadow-lg">
                  <Heart className="w-3 h-3 mr-1" />
                  {isArabic ? "الأكثر طلباً" : "Most Popular"}
                </Badge>
              )}
            </div>

            {/* عداد الحجوزات */}
            {service.bookingCount && (
              <div className="absolute bottom-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-black/60 text-white backdrop-blur-sm"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {service.bookingCount} {isArabic ? "حجز" : "bookings"}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {service.title[isArabic ? "ar" : "en"]}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.shortDescription?.[isArabic ? "ar" : "en"] ||
                  service.description[isArabic ? "ar" : "en"]}
              </p>
            </div>

            {/* معلومات متقدمة */}
            <div className="space-y-3 mb-6">
              {service.rating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(service.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {service.reviewCount} {isArabic ? "تقييم" : "reviews"}
                  </span>
                </div>
              )}

              {service.duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {service.duration[isArabic ? "ar" : "en"]}
                  </span>
                </div>
              )}
            </div>

            {/* السعر والحجز */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                {service.price && (
                  <div>
                    <div className="flex items-baseline gap-1">
                      {service.discount && (
                        <span className="text-lg text-gray-400 line-through">
                          {Math.round(
                            service.price.min *
                              (1 + service.discount.percentage / 100),
                          )}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-blue-600">
                        {service.price.min}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.price.currency}
                      </span>
                    </div>
                    {service.price.unit && (
                      <p className="text-xs text-gray-500">
                        {service.price.unit[isArabic ? "ar" : "en"]}
                      </p>
                    )}
                  </div>
                )}

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  {isArabic ? "احجز الآن" : "Book Now"}
                  <Zap className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // شكل مينيمال
  const renderMinimalLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white border border-gray-100"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
            {service.title[isArabic ? "ar" : "en"]}
          </h3>

          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            {service.shortDescription?.[isArabic ? "ar" : "en"]}
          </p>

          {service.price && (
            <div className="mb-4">
              <span
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                {service.price.min} {service.price.currency}
              </span>
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full">
            {isArabic ? "عرض التفاصيل" : "View Details"}
          </Button>
        </Card>
      ))}
    </div>
  );

  // عرض الفلاتر
  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {/* فلتر الفئات */}
      {data.categories && data.categories.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">الفئة:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 rounded border bg-white dark:bg-gray-700"
          >
            <option value="all">
              {isArabic ? "جميع الفئات" : "All Categories"}
            </option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name[isArabic ? "ar" : "en"]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* فلتر الترتيب */}
      {data.sortOptions && data.sortOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">الترتيب:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded border bg-white dark:bg-gray-700"
          >
            {data.sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name[isArabic ? "ar" : "en"]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  if (!isVisible && !isPreview) return null;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="loading-skeleton h-8 w-64 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loading-skeleton h-80 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className={`py-16 ${!isVisible ? "opacity-50" : ""}`}
      style={{
        backgroundColor: sectionSettings?.backgroundColor || colors.background,
        padding: sectionSettings?.padding,
        margin: sectionSettings?.margin,
        ...sectionSettings?.customStyles,
      }}
    >
      <div className="container mx-auto px-4">
        {/* العنوان والوصف */}
        {(data.title || data.subtitle || data.description) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                {data.title[isArabic ? "ar" : "en"]}
              </h2>
            )}
            {data.subtitle && (
              <h3
                className="text-xl md:text-2xl mb-6"
                style={{ color: colors.textSecondary }}
              >
                {data.subtitle[isArabic ? "ar" : "en"]}
              </h3>
            )}
            {data.description && (
              <p
                className="text-lg max-w-3xl mx-auto"
                style={{ color: colors.textSecondary }}
              >
                {data.description[isArabic ? "ar" : "en"]}
              </p>
            )}
          </div>
        )}

        {/* الفلاتر */}
        {data.enableFilters && renderFilters()}

        {/* عرض الخدمات حسب النمط المحدد */}
        <div className="mb-12">
          {serviceStyle === "grid" && renderGridLayout()}
          {serviceStyle === "carousel" && renderCarouselLayout()}
          {serviceStyle === "list" && renderListLayout()}
          {serviceStyle === "masonry" && renderMasonryLayout()}
          {serviceStyle === "cards" && renderCardsLayout()}
          {serviceStyle === "minimal" && renderMinimalLayout()}
        </div>

        {/* زر عرض المزيد */}
        {!data.showAll &&
          data.viewAllButton &&
          filteredServices.length >= showCount && (
            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r hover:shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: "white",
                }}
              >
                {data.viewAllButton[isArabic ? "ar" : "en"]}
                <Eye className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
      </div>
    </section>
  );
}
