"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import { useNotify } from "./NotificationSystem";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  CheckCircle,
  Sparkles,
  Home,
  Building,
  Droplets,
  Bug,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Award,
  Users,
  Zap,
  Heart,
  MessageCircle,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: string;
  categoryAr: string;
  price: string;
  priceAr: string;
  duration: string;
  durationAr: string;
  featured: boolean;
  active: boolean;
  features: string[];
  featuresAr: string[];
  image?: string; // Added for service images
  rating?: number; // Added for service rating
  reviewCount?: number; // Added for review count
}

interface CompanyInfo {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  tagline: string;
  taglineAr: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  addressAr: string;
  foundedYear: number;
  employeesCount: number;
  projectsCompleted: number;
  satisfactionRate: number;
  businessHours: {
    weekdays: string;
    weekdaysAr: string;
    weekends: string;
    weekendsAr: string;
  };
  socialMedia: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  services: {
    mainCategory: string;
    mainCategoryAr: string;
    specialties: string[];
    specialtiesAr: string[];
  };
  certifications: string[];
  certificationsAr: string[];
}

interface ServicesData {
  services: Service[];
  metadata: {
    company: {
      name: string;
      nameAr: string;
      description: string;
      descriptionAr: string;
      website: string;
      phone: string;
      email: string;
    };
  };
}

interface SiteContent {
  heroSection: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    description: string;
    descriptionAr: string;
    ctaText: string;
    ctaTextAr: string;
  };
  featuredSection: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
  };
  whyChooseUs: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    features: Array<{
      title: string;
      titleAr: string;
      description: string;
      descriptionAr: string;
      icon: string;
    }>;
  };
  contactCta: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    buttons: {
      call: {
        text: string;
        textAr: string;
      };
      message: {
        text: string;
        textAr: string;
      };
    };
  };
}

const iconMap = {
  Sparkles,
  Home,
  Building,
  Droplets,
  Bug,
  Shield,
  Calendar,
  CheckCircle,
  Award,
  Users,
  Zap,
};

export default function CleaningServices() {
  const { t, currentLanguage } = useTranslation();
  const notify = useNotify();
  const [services, setServices] = useState<Service[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAllContent();
    loadFavorites();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);

      // Load services data
      const servicesResponse = await fetch("/api/admin/services");
      if (servicesResponse.ok) {
        const apiResponse = await servicesResponse.json();
        // Handle API response structure - data is in the 'data' field
        const services = apiResponse.data || [];
        setServices(services.filter((s: Service) => s.active)); // Only show active services
      }

      // Load company information
      const companyResponse = await fetch("/api/company-info");
      if (companyResponse.ok) {
        const responseData = await companyResponse.json();
        // Handle the API response structure which wraps company info in a 'company' object
        const companyData: CompanyInfo = responseData.company || responseData;
        setCompanyInfo(companyData);
      }

      // Load site content
      const contentResponse = await fetch("/api/admin/site-content");
      if (contentResponse.ok) {
        const responseData = await contentResponse.json();
        // Handle the API response structure which wraps content in a 'content' object
        const contentData: SiteContent = responseData.content || responseData;
        setSiteContent(contentData);
      } else {
        // Set default content if API doesn't exist yet
        setSiteContent(getDefaultSiteContent());
      }
    } catch (error) {
      console.error("Failed to load content:", error);
      // Set fallback content
      setSiteContent(getDefaultSiteContent());
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem("service-favorites");
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(
        "service-favorites",
        JSON.stringify(Array.from(newFavorites)),
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = (serviceId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId);
      notify.info(
        "تمت الإزالة من المفضلة",
        "تم إزالة الخدمة من قائمة المفضلة",
        "Removed from Favorites",
        "Service removed from favorites",
      );
    } else {
      newFavorites.add(serviceId);
      notify.success(
        "أضيفت للمفضلة",
        "تم إضافة الخدمة لقائمة المفضلة",
        "Added to Favorites",
        "Service added to favorites",
      );
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const handleBookService = (service: Service) => {
    notify.success(
      "طلب الحجز",
      `تم إرسال طلب حجز خدمة ${isArabic ? service.titleAr : service.title}`,
      "Booking Request",
      `Booking request sent for ${service.title}`,
    );

    // In a real implementation, this would:
    // 1. Open booking form modal
    // 2. Navigate to booking page
    // 3. Send booking data to backend
    console.log("Booking service:", service);
  };

  const handleContactForService = (service: Service) => {
    const message = `${isArabic ? "مرحبا، أريد الاستفسار عن خدمة" : "Hello, I want to inquire about"} ${isArabic ? service.titleAr : service.title}`;
    const whatsappUrl = `https://wa.me/${companyInfo?.socialMedia?.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    notify.info(
      "فتح واتساب",
      "تم فتح واتساب للتواصل مع خدمة العملاء",
      "Opening WhatsApp",
      "Opening WhatsApp to contact customer service",
    );
  };

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self");
    notify.info(
      "الاتصال",
      "تم فتح تطبيق الهاتف للاتصال",
      "Phone Call",
      "Opening phone app to make a call",
    );
  };

  const getDefaultSiteContent = (): SiteContent => ({
    heroSection: {
      title: "Professional Cleaning Services",
      titleAr: "خدمات التنظيف المهنية",
      subtitle: "Your trusted partner for all cleaning needs",
      subtitleAr: "شريكك الموثوق لجميع احتياجات التنظيف",
      description:
        "We provide professional cleaning services using the latest American and European equipment with over 6 years of experience in the Saudi market",
      descriptionAr:
        "نقدم خدمات تنظيف مهنية باستخدام أحدث المعدات الأمريكية والأوروبية مع أكثر من 6 سنوات من الخبرة في السوق السعودي",
      ctaText: "Get Free Quote",
      ctaTextAr: "احصل على عرض مجاني",
    },
    featuredSection: {
      title: "Our Featured Services",
      titleAr: "خدماتنا المميزة",
      subtitle: "Professional cleaning solutions for all your needs",
      subtitleAr: "حلول تنظيف مهنية لجميع احتياجاتك",
    },
    whyChooseUs: {
      title: "Why Choose Us?",
      titleAr: "لماذا تختارنا؟",
      subtitle:
        "We provide professional cleaning services with the highest quality standards",
      subtitleAr: "نقدم خدمات تنظيف احترافية بأعلى معايير الجودة",
      features: [
        {
          title: "American & European Equipment",
          titleAr: "معدات أمريكية وأوروبية",
          description: "We use the latest advanced equipment and technologies",
          descriptionAr: "نستخدم أحدث المعدات والتقنيات المتطورة",
          icon: "Award",
        },
        {
          title: "Qualified Professional Team",
          titleAr: "فريق محترف مؤهل",
          description:
            "Highly experienced technicians trained on latest techniques",
          descriptionAr: "فنيون ذوو خبرة عالية ومدربون على أحدث التقنيات",
          icon: "Users",
        },
        {
          title: "Fast & Reliable Service",
          titleAr: "خدمة سريعة وموثوقة",
          description: "We guarantee timely completion with highest quality",
          descriptionAr: "نضمن إنجاز العمل في الوقت المحدد بأعلى جودة",
          icon: "Zap",
        },
      ],
    },
    contactCta: {
      title: "Need a Free Consultation?",
      titleAr: "هل تحتاج استشارة مجانية؟",
      description:
        "Contact us today for a free consultation and customized quote for your needs",
      descriptionAr:
        "تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك",
      buttons: {
        call: {
          text: "Call Us",
          textAr: "اتصل بنا",
        },
        message: {
          text: "Send Message",
          textAr: "أرسل رسالة",
        },
      },
    },
  });

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Sparkles;
    return <IconComponent className={className} />;
  };

  const isArabic = currentLanguage === "ar";
  const isRTL = () => isArabic;

  const categories = [
    ...new Set(services.map((s) => (isArabic ? s.categoryAr : s.category))),
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter(
          (s) => (isArabic ? s.categoryAr : s.category) === selectedCategory,
        );

  const featuredServices = services.filter((s) => s.featured && s.active);

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/80 via-white to-green-50/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16 lg:mb-24">
            <div className="h-12 bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl w-80 mx-auto mb-6 animate-pulse backdrop-blur-sm"></div>
            <div className="h-6 bg-gray-200/60 dark:bg-gray-700/60 rounded-xl w-96 mx-auto mb-4 animate-pulse backdrop-blur-sm"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl animate-pulse backdrop-blur-sm"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/80 via-white to-green-50/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        {companyInfo && siteContent && (
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              {isArabic
                ? siteContent.heroSection.subtitleAr
                : siteContent.heroSection.subtitle}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-green-700 dark:from-white dark:via-blue-200 dark:to-green-300 bg-clip-text text-transparent">
                {isArabic
                  ? companyInfo.nameAr || companyInfo.name
                  : companyInfo.name}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
              {isArabic
                ? companyInfo.taglineAr || siteContent.heroSection.descriptionAr
                : companyInfo.tagline || siteContent.heroSection.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-sm text-gray-600 dark:text-gray-400 mb-10">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span dir="ltr" className="font-medium">
                  {companyInfo.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium">{companyInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium">
                  {isArabic
                    ? companyInfo.addressAr || "المملكة العربية السعودية"
                    : companyInfo.address || "Saudi Arabia"}
                </span>
              </div>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {companyInfo.foundedYear &&
                    new Date().getFullYear() - companyInfo.foundedYear}
                  +
                </div>
                <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {isArabic ? "سنوات الخبرة" : "Years Experience"}
                </div>
              </div>
              <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  <span suppressHydrationWarning>
                    {companyInfo.projectsCompleted?.toLocaleString()}+
                  </span>
                </div>
                <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {isArabic ? "مشروع مكتمل" : "Projects Done"}
                </div>
              </div>
              <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {companyInfo.employeesCount}+
                </div>
                <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {isArabic ? "موظف متخصص" : "Team Members"}
                </div>
              </div>
              <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {companyInfo.satisfactionRate}%
                </div>
                <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {isArabic ? "رضا العملاء" : "Satisfaction"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Services Quick Overview */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              {siteContent
                ? isArabic
                  ? siteContent.featuredSection.titleAr
                  : siteContent.featuredSection.title
                : isArabic
                  ? "خدماتنا المميزة"
                  : "Our Featured Services"}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {siteContent
                ? isArabic
                  ? siteContent.featuredSection.subtitleAr
                  : siteContent.featuredSection.subtitle
                : isArabic
                  ? "حلول تنظيف مهنية لجميع احتياجاتك"
                  : "Professional cleaning solutions for all your needs"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredServices.slice(0, 4).map((service) => (
              <Card
                key={service.id}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl text-white w-20 h-20 flex items-center justify-center shadow-lg ring-8 ring-blue-100 dark:ring-blue-900/20">
                    {renderIcon(service.icon, "w-8 h-8")}
                  </div>
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                    {isArabic ? service.titleAr : service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {isArabic ? service.priceAr : service.price}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                      <Clock className="w-4 h-4" />
                      {isArabic ? service.durationAr : service.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 lg:mb-16">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full px-6 py-3 font-semibold transition-all duration-200 hover:shadow-lg"
            >
              {isArabic ? "جميع الخدمات" : "All Services"}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6 py-3 font-semibold transition-all duration-200 hover:shadow-lg"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Service Cards with Professional Design */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="group relative overflow-hidden card-elevated prevent-bleed bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ring-1 ring-gray-100/50 dark:ring-gray-700/50"
            >
              {/* Service Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-purple-500/10 overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={isArabic ? service.titleAr : service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500">
                    {renderIcon(service.icon, "w-16 h-16 text-white")}
                  </div>
                )}

                {/* Floating Favorite Button */}
                <button
                  onClick={() => toggleFavorite(service.id)}
                  className={`
                    absolute top-3 ${isRTL() ? "left-3" : "right-3"} w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    ${
                      favorites.has(service.id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-md"
                    }
                  `}
                  aria-pressed={favorites.has(service.id)}
                  aria-label={
                    favorites.has(service.id)
                      ? isArabic
                        ? "إزالة من المفضلة"
                        : "Remove from favorites"
                      : isArabic
                        ? "إضافة للمفضلة"
                        : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${favorites.has(service.id) ? "scale-110" : "hover:scale-110"}`}
                  />
                </button>

                {/* Service Badge */}
                {service.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    {isArabic ? "مميز" : "Featured"}
                  </div>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs font-medium">
                    {isArabic ? service.categoryAr : service.category}
                  </Badge>
                  {service.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {service.rating}
                      </span>
                      {service.reviewCount && (
                        <span className="text-xs text-gray-500">
                          ({service.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {isArabic ? service.titleAr : service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isArabic ? service.descriptionAr : service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing & Duration */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {isArabic ? service.priceAr : service.price}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    {isArabic ? service.durationAr : service.duration}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {isArabic ? "المميزات الرئيسية:" : "Key Features:"}
                  </h4>
                  <div className="space-y-2">
                    {(isArabic ? service.featuresAr : service.features)
                      .slice(0, 3)
                      .map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Primary Book Now Button */}
                  <button
                    onClick={() => handleBookService(service)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
                    aria-label={
                      isArabic
                        ? `احجز خدمة ${service.titleAr}`
                        : `Book ${service.title} service`
                    }
                  >
                    {isArabic ? "احجز الآن" : "Book Now"}
                    {isRTL() ? (
                      <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  {/* Secondary Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleContactForService(service)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      title={
                        isArabic ? "تواصل عبر واتساب" : "Contact via WhatsApp"
                      }
                      aria-label={
                        isArabic ? "تواصل عبر واتساب" : "Contact via WhatsApp"
                      }
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        const phoneNumber = companyInfo?.phone || "0559061065";
                        handlePhoneCall(phoneNumber);
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      title={isArabic ? "اتصل الآن" : "Call Now"}
                      aria-label={isArabic ? "اتصل الآن" : "Call Now"}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        {siteContent && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {isArabic
                  ? siteContent.whyChooseUs.titleAr
                  : siteContent.whyChooseUs.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {isArabic
                  ? siteContent.whyChooseUs.subtitleAr
                  : siteContent.whyChooseUs.subtitle}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {siteContent.whyChooseUs.features.map((feature, index) => {
                const iconColors = [
                  {
                    bg: "bg-blue-100 dark:bg-blue-900/30",
                    text: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    bg: "bg-green-100 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-400",
                  },
                  {
                    bg: "bg-purple-100 dark:bg-purple-900/30",
                    text: "text-purple-600 dark:text-purple-400",
                  },
                ];
                const color = iconColors[index % iconColors.length];

                return (
                  <div key={index} className="text-center">
                    <div
                      className={`mx-auto mb-4 w-16 h-16 ${color.bg} rounded-full flex items-center justify-center`}
                    >
                      {feature.icon === "Award" && (
                        <Award className={`w-8 h-8 ${color.text}`} />
                      )}
                      {feature.icon === "Users" && (
                        <Users className={`w-8 h-8 ${color.text}`} />
                      )}
                      {feature.icon === "Zap" && (
                        <Zap className={`w-8 h-8 ${color.text}`} />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {isArabic ? feature.titleAr : feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isArabic ? feature.descriptionAr : feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        {siteContent && companyInfo && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 tracking-tight">
                {isArabic
                  ? siteContent.contactCta.titleAr
                  : siteContent.contactCta.title}
              </h3>
              <p className="text-blue-50 text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
                {isArabic
                  ? siteContent.contactCta.descriptionAr
                  : siteContent.contactCta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-semibold px-8 py-4"
                  onClick={() =>
                    window.open(`tel:${companyInfo.phone}`, "_self")
                  }
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {isArabic
                    ? siteContent.contactCta.buttons.call.textAr
                    : siteContent.contactCta.buttons.call.text}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all duration-200 font-semibold px-8 py-4"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${companyInfo.socialMedia?.whatsapp?.replace(/[^0-9]/g, "")}`,
                      "_blank",
                    )
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isArabic
                    ? siteContent.contactCta.buttons.message.textAr
                    : siteContent.contactCta.buttons.message.text}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
