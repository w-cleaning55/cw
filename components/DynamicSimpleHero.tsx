"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Play,
  Star,
  Users,
  CheckCircle,
  Calendar,
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";

interface HeroProps {
  data: {
    style?: "classic" | "modern" | "minimal" | "video" | "split" | "gradient";
    title: { ar: string; en: string };
    subtitle?: { ar: string; en: string };
    description?: { ar: string; en: string };
    cta?: { ar: string; en: string };
    ctaSecondary?: { ar: string; en: string };
    backgroundImage?: string;
    backgroundVideo?: string;
    overlay?: boolean;
    overlayOpacity?: number;
    showStats?: boolean;
    stats?: Array<{
      value: string;
      label: { ar: string; en: string };
      icon?: string;
    }>;
    features?: Array<{
      text: { ar: string; en: string };
      icon?: string;
    }>;
    showRating?: boolean;
    rating?: number;
    reviewCount?: number;
    badges?: Array<{
      text: { ar: string; en: string };
      color?: string;
    }>;
  };
  settings?: any;
  sectionSettings?: any;
  isVisible?: boolean;
  isPreview?: boolean;
}

export default function DynamicSimpleHero({
  data,
  settings,
  sectionSettings,
  isVisible = true,
  isPreview = false,
}: HeroProps) {
  const { t, isArabic } = useTranslation();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!isVisible && !isPreview) return null;

  const heroStyle = data.style || "classic";
  const backgroundImage = data.backgroundImage || "/images/hero-banner.svg";
  const hasVideo = data.backgroundVideo && data.backgroundVideo.length > 0;

  // الأشكال المختلفة للبانر
  const renderClassicHero = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* الخلفية */}
      <div className="absolute inset-0">
        {hasVideo && isVideoPlaying ? (
          <video className="w-full h-full object-cover" autoPlay muted loop>
            <source src={data.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={backgroundImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        )}
        {data.overlay && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: data.overlayOpacity || 0.5 }}
          />
        )}
      </div>

      {/* المحتوى */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* الشارات */}
          {data.badges && data.badges.length > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              {data.badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`px-3 py-1 ${badge.color || "bg-blue-100 text-blue-800"}`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {badge.text[isArabic ? "ar" : "en"]}
                </Badge>
              ))}
            </div>
          )}

          {/* العنوان الر��يسي */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {data.title[isArabic ? "ar" : "en"]}
          </h1>

          {/* العنوان الفرعي */}
          {data.subtitle && (
            <h2 className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-100">
              {data.subtitle[isArabic ? "ar" : "en"]}
            </h2>
          )}

          {/* الوصف */}
          {data.description && (
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-3xl mx-auto">
              {data.description[isArabic ? "ar" : "en"]}
            </p>
          )}

          {/* التقييم */}
          {data.showRating && data.rating && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < data.rating!
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{data.rating}</span>
              {data.reviewCount && (
                <span className="text-gray-300">
                  ({data.reviewCount} {isArabic ? "تقييم" : "reviews"})
                </span>
              )}
            </div>
          )}

          {/* المميزات السريعة */}
          {data.features && data.features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {data.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">
                    {feature.text[isArabic ? "ar" : "en"]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {data.cta && (
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                {data.cta[isArabic ? "ar" : "en"]}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            {data.ctaSecondary && (
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {data.ctaSecondary[isArabic ? "ar" : "en"]}
              </Button>
            )}
            {hasVideo && !isVideoPlaying && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsVideoPlaying(true)}
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Play className="w-5 h-5 mr-2" />
                {isArabic ? "شاهد الفيديو" : "Watch Video"}
              </Button>
            )}
          </div>

          {/* الإحصائيات */}
          {data.showStats && data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stat.label[isArabic ? "ar" : "en"]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderModernHero = () => (
    <section className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* المحتوى */}
          <div className="space-y-8">
            {/* الشارات */}
            {data.badges && data.badges.length > 0 && (
              <div className="flex gap-2">
                {data.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {badge.text[isArabic ? "ar" : "en"]}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
              {data.title[isArabic ? "ar" : "en"]}
            </h1>

            {data.subtitle && (
              <h2 className="text-xl md:text-2xl text-gray-600">
                {data.subtitle[isArabic ? "ar" : "en"]}
              </h2>
            )}

            {data.description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {data.description[isArabic ? "ar" : "en"]}
              </p>
            )}

            {/* المميزات */}
            {data.features && data.features.length > 0 && (
              <div className="space-y-3">
                {data.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">
                      {feature.text[isArabic ? "ar" : "en"]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-4">
              {data.cta && (
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {data.cta[isArabic ? "ar" : "en"]}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              {data.ctaSecondary && (
                <Button variant="outline" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {data.ctaSecondary[isArabic ? "ar" : "en"]}
                </Button>
              )}
            </div>

            {/* الإحصائيات */}
            {data.showStats && data.stats && data.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                {data.stats.slice(0, 3).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label[isArabic ? "ar" : "en"]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* الصورة */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
              <img
                src={backgroundImage}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
            {/* عنصر ديكوري */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 rounded-2xl opacity-10"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-600 rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderMinimalHero = () => (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* شارة بسيطة */}
          {data.badges && data.badges[0] && (
            <Badge variant="outline" className="mx-auto">
              {data.badges[0].text[isArabic ? "ar" : "en"]}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {data.title[isArabic ? "ar" : "en"]}
          </h1>

          {data.subtitle && (
            <p className="text-xl text-gray-600">
              {data.subtitle[isArabic ? "ar" : "en"]}
            </p>
          )}

          {data.description && (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {data.description[isArabic ? "ar" : "en"]}
            </p>
          )}

          <div className="flex justify-center gap-4">
            {data.cta && (
              <Button size="lg">{data.cta[isArabic ? "ar" : "en"]}</Button>
            )}
            {data.ctaSecondary && (
              <Button variant="outline" size="lg">
                {data.ctaSecondary[isArabic ? "ar" : "en"]}
              </Button>
            )}
          </div>

          {/* الإحصائيات البسيطة */}
          {data.showStats && data.stats && data.stats.length > 0 && (
            <div className="flex justify-center divide-x pt-12">
              {data.stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="px-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label[isArabic ? "ar" : "en"]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderGradientHero = () => (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* عنصر ديكوري */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {data.title[isArabic ? "ar" : "en"]}
          </h1>

          {data.subtitle && (
            <h2 className="text-2xl md:text-3xl text-gray-100">
              {data.subtitle[isArabic ? "ar" : "en"]}
            </h2>
          )}

          {data.description && (
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {data.description[isArabic ? "ar" : "en"]}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {data.cta && (
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg"
              >
                {data.cta[isArabic ? "ar" : "en"]}
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
            )}
            {data.ctaSecondary && (
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg"
              >
                {data.ctaSecondary[isArabic ? "ar" : "en"]}
              </Button>
            )}
          </div>

          {/* شبكة الإحصائيات */}
          {data.showStats && data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              {data.stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center"
                >
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-200">
                    {stat.label[isArabic ? "ar" : "en"]}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderSplitHero = () => (
    <section className="min-h-screen grid lg:grid-cols-2">
      {/* الجانب الأيسر - المحتوى */}
      <div className="flex items-center bg-gray-50 p-8 lg:p-16">
        <div className="max-w-lg mx-auto space-y-8">
          {data.badges && data.badges[0] && (
            <Badge className="bg-blue-100 text-blue-800">
              <Award className="w-3 h-3 mr-1" />
              {data.badges[0].text[isArabic ? "ar" : "en"]}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {data.title[isArabic ? "ar" : "en"]}
          </h1>

          {data.subtitle && (
            <h2 className="text-xl text-gray-700">
              {data.subtitle[isArabic ? "ar" : "en"]}
            </h2>
          )}

          {data.description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {data.description[isArabic ? "ar" : "en"]}
            </p>
          )}

          {/* مميزات مع أيقونات */}
          {data.features && data.features.length > 0 && (
            <div className="space-y-4">
              {data.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">
                    {feature.text[isArabic ? "ar" : "en"]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {data.cta && (
              <Button size="lg" className="w-full sm:w-auto">
                {data.cta[isArabic ? "ar" : "en"]}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            {data.ctaSecondary && (
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                {data.ctaSecondary[isArabic ? "ar" : "en"]}
              </Button>
            )}
          </div>

          {/* الإحصائيات الجانبية */}
          {data.showStats && data.stats && data.stats.length > 0 && (
            <div className="flex gap-8 pt-8 border-t">
              {data.stats.slice(0, 2).map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold text-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label[isArabic ? "ar" : "en"]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* الجانب الأيمن - الصورة */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700">
        <img
          src={backgroundImage}
          alt="Hero"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* عنصر ديكوري */}
        <div className="absolute bottom-8 left-8 right-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {isArabic ? "مضمون 100%" : "100% Guaranteed"}
                </div>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "ضمان شامل على جميع الخدمات"
                    : "Full warranty on all services"}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );

  const renderVideoHero = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* خلفية الفيديو */}
      <div className="absolute inset-0">
        {hasVideo ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            poster={backgroundImage}
          >
            <source src={data.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={backgroundImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* المحتوى */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* زر تشغيل الفيديو */}
          {hasVideo && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {data.title[isArabic ? "ar" : "en"]}
          </h1>

          {data.subtitle && (
            <h2 className="text-2xl md:text-3xl text-gray-100">
              {data.subtitle[isArabic ? "ar" : "en"]}
            </h2>
          )}

          {data.description && (
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {data.description[isArabic ? "ar" : "en"]}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {data.cta && (
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg"
              >
                {data.cta[isArabic ? "ar" : "en"]}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            {data.ctaSecondary && (
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {data.ctaSecondary[isArabic ? "ar" : "en"]}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // اختيار الشكل المناسب
  const renderHero = () => {
    switch (heroStyle) {
      case "modern":
        return renderModernHero();
      case "minimal":
        return renderMinimalHero();
      case "gradient":
        return renderGradientHero();
      case "split":
        return renderSplitHero();
      case "video":
        return renderVideoHero();
      default:
        return renderClassicHero();
    }
  };

  return (
    <div
      className={`dynamic-hero ${!isVisible ? "opacity-50" : ""}`}
      style={{
        backgroundColor: sectionSettings?.backgroundColor,
        padding: sectionSettings?.padding,
        margin: sectionSettings?.margin,
        ...sectionSettings?.customStyles,
      }}
    >
      {renderHero()}
    </div>
  );
}
