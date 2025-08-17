"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColors } from "@/hooks/useTheme";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Clock,
  Award,
  Users,
  Phone,
  DollarSign,
  Star,
  CheckCircle,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  Eye,
  Target,
  Settings,
  Gem,
  Leaf,
  Globe,
  Headphones,
  Truck,
  Calendar,
  Lock,
  ThumbsUp,
  Rocket,
  Lightbulb,
  Briefcase,
  Home,
  Building,
  Car,
  Wrench,
  Droplets,
  Bug,
  X,
} from "lucide-react";

interface Feature {
  id: string;
  icon: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  color?: string;
  highlighted?: boolean;
  comingSoon?: boolean;
  stats?: {
    value: string;
    label: { ar: string; en: string };
  };
}

interface FeaturesSectionProps {
  data: {
    style?:
      | "grid"
      | "carousel"
      | "timeline"
      | "comparison"
      | "hexagon"
      | "minimal"
      | "cards3d";
    title?: { ar: string; en: string };
    subtitle?: { ar: string; en: string };
    description?: { ar: string; en: string };
    layout?: "3columns" | "4columns" | "2columns" | "6columns";
    showStats?: boolean;
    animateOnScroll?: boolean;
    backgroundPattern?: "none" | "dots" | "lines" | "geometric";
    features: Feature[];
  };
  settings?: any;
  sectionSettings?: any;
  isVisible?: boolean;
  isPreview?: boolean;
}

const ICON_MAP: Record<string, any> = {
  Shield,
  Clock,
  Award,
  Users,
  Phone,
  DollarSign,
  Star,
  CheckCircle,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  Eye,
  Target,
  Settings,
  Gem,
  Leaf,
  Globe,
  Headphones,
  Truck,
  Calendar,
  Lock,
  ThumbsUp,
  Rocket,
  Lightbulb,
  Briefcase,
  Home,
  Building,
  Car,
  Wrench,
  Droplets,
  Bug,
};

export default function DynamicFeaturesSection({
  data,
  settings,
  sectionSettings,
  isVisible = true,
  isPreview = false,
}: FeaturesSectionProps) {
  const { t, isRTL } = useTranslation();
  const isArabic = isRTL;
  const colors = useThemeColors();

  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const featureStyle = data.style || "grid";
  const layout = data.layout || "3columns";

  const getGridColumns = () => {
    switch (layout) {
      case "2columns":
        return "grid-cols-1 md:grid-cols-2";
      case "3columns":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case "4columns":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case "6columns":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getFeatureIcon = (iconName: string, color: string = colors.primary) => {
    const IconComponent = ICON_MAP[iconName] || Shield;
    return <IconComponent className="w-6 h-6" style={{ color }} />;
  };

  // شكل الشبكة الكلاسيكي
  const renderGridLayout = () => (
    <div className={`grid ${getGridColumns()} gap-8`}>
      {data.features.map((feature, index) => (
        <Card
          key={feature.id}
          className={`group p-6 text-center hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
            feature.highlighted ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            backgroundColor: colors.card,
            borderColor: feature.highlighted ? colors.primary : colors.border,
          }}
          onMouseEnter={() => setHoveredFeature(feature.id)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          {/* أيقونة */}
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
              hoveredFeature === feature.id ? "scale-110" : ""
            }`}
            style={{
              backgroundColor: feature.color || colors.primary + "20",
              border: `2px solid ${feature.color || colors.primary}`,
            }}
          >
            {getFeatureIcon(feature.icon, feature.color || colors.primary)}
          </div>

          {/* العنوان */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
            {getLocalizedText(feature.title, isArabic, "عنوان")}
          </h3>

          {/* الوصف */}
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: colors["muted-foreground"] }}
          >
            {getLocalizedText(feature.description, isArabic, "وصف")}
          </p>

          {/* الإحصائيات */}
          {data.showStats && feature.stats && (
            <div className="border-t pt-4">
              <div
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {feature.stats.value}
              </div>
              <div className="text-xs" style={{ color: colors["muted-foreground"] }}>
                {getLocalizedText(feature.stats.label, isArabic, "تسمية")}
              </div>
            </div>
          )}

          {/* شارة قريباً */}
          {feature.comingSoon && (
            <Badge className="mt-3 bg-orange-100 text-orange-800">
              {isArabic ? "قريباً" : "Coming Soon"}
            </Badge>
          )}
        </Card>
      ))}
    </div>
  );

  // شكل الكاروسيل
  const renderCarouselLayout = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(${-currentSlide * 100}%)` }}
        >
          {data.features.map((feature, index) => (
            <div key={feature.id} className="w-full flex-shrink-0 p-8">
              <div className="max-w-4xl mx-auto text-center">
                {/* أيقونة كبيرة */}
                <div
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: feature.color || colors.primary + "20",
                  }}
                >
                  {getFeatureIcon(
                    feature.icon,
                    feature.color || colors.primary,
                  )}
                </div>

                <h3
                  className="text-3xl font-bold mb-4"
                  style={{ color: colors.foreground }}
                >
                  {getLocalizedText(feature.title, isArabic, "ميزة")}
                </h3>

                <p
                  className="text-xl leading-relaxed max-w-2xl mx-auto"
                  style={{ color: colors["muted-foreground"] }}
                >
                  {getLocalizedText(feature.description, isArabic, "وصف الميزة")}
                </p>

                {feature.stats && (
                  <div className="mt-8 inline-block">
                    <div
                      className="text-4xl font-bold mb-2"
                      style={{ color: colors.primary }}
                    >
                      {feature.stats.value}
                    </div>
                    <div
                      className="text-lg"
                      style={{ color: colors["muted-foreground"] }}
                    >
                      {getLocalizedText(feature.stats.label, isArabic, "تسمية")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مؤشرات */}
      <div className="flex justify-center mt-8 gap-2">
        {data.features.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-blue-500 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );

  // شكل الخط الزمني
  const renderTimelineLayout = () => (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* الخط المركزي */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

        {data.features.map((feature, index) => (
          <div
            key={feature.id}
            className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* المحتوى */}
            <div
              className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div
                  className={`flex items-center gap-3 mb-3 ${
                    index % 2 === 0 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: feature.color || colors.primary + "20",
                    }}
                  >
                    {getFeatureIcon(
                      feature.icon,
                      feature.color || colors.primary,
                    )}
                  </div>
                  <h3 className="text-lg font-bold">
                    {getLocalizedText(feature.title, isArabic, "عنوان")}
                  </h3>
                </div>
                <p className="text-sm" style={{ color: colors["muted-foreground"] }}>
                  {getLocalizedText(feature.description, isArabic, "وصف")}
                </p>
              </Card>
            </div>

            {/* النقطة المركزية */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: feature.color || colors.primary }}
            ></div>

            {/* رقم الخطوة */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold border-2"
              style={{
                borderColor: feature.color || colors.primary,
                color: feature.color || colors.primary,
              }}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // شكل المقارنة
  const renderComparisonLayout = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {/* العمود الأيسر */}
      <div>
        <h3
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: colors.foreground }}
        >
          {isArabic ? "مع خدماتنا" : "With Our Services"}
        </h3>
        <div className="space-y-4">
          {data.features
            .filter((_, i) => i % 2 === 0)
            .map((feature) => (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">
                    {getLocalizedText(feature.title, isArabic, "عنوان")}
                  </h4>
                  <p className="text-sm text-green-700">
                    {getLocalizedText(feature.description, isArabic, "وصف")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* العمود الأيمن */}
      <div>
        <h3
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: colors.foreground }}
        >
          {isArabic ? "بدون خدماتنا" : "Without Our Services"}
        </h3>
        <div className="space-y-4">
          {data.features
            .filter((_, i) => i % 2 !== 0)
            .map((feature) => (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">
                    {getLocalizedText(feature.title, isArabic, "عنوان")}
                  </h4>
                  <p className="text-sm text-red-700">
                    {getLocalizedText(feature.description, isArabic, "وصف")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // شكل السداسي
  const renderHexagonLayout = () => (
    <div className="relative max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
        {data.features.map((feature, index) => (
          <div
            key={feature.id}
            className="relative group cursor-pointer"
            style={{
              transform:
                index === 1
                  ? "translateY(-20px)"
                  : index === 4
                    ? "translateY(-20px)"
                    : "translateY(0)",
            }}
          >
            {/* الشكل السداسي */}
            <div className="relative w-32 h-32 mx-auto">
              <div
                className="absolute inset-0 transform rotate-45 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: feature.color || colors.primary + "20",
                  borderRadius: "20%",
                }}
              >
                <div className="absolute inset-2 transform -rotate-45 flex items-center justify-center">
                  {getFeatureIcon(
                    feature.icon,
                    feature.color || colors.primary,
                  )}
                </div>
              </div>
            </div>

            {/* النص */}
            <div className="text-center mt-4">
              <h3 className="font-bold mb-2">
                {getLocalizedText(feature.title, isArabic, "عنوان")}
              </h3>
              <p className="text-sm" style={{ color: colors["muted-foreground"] }}>
                {getLocalizedText(feature.description, isArabic, "وصف")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // شكل بطاقات 3D
  const renderCards3DLayout = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
      {data.features.map((feature, index) => (
        <div
          key={feature.id}
          className="group relative h-64 preserve-3d transition-all duration-700 hover:rotate-y-180 cursor-pointer"
          onMouseEnter={() => setHoveredFeature(feature.id)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          {/* الوجه الأمامي */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg"
            style={{ backgroundColor: feature.color || colors.primary }}
          >
            <div className="w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center">
              {getFeatureIcon(feature.icon, feature.color || colors.primary)}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {getLocalizedText(feature.title, isArabic, "عنوان")}
            </h3>
            <div className="w-8 h-1 bg-white rounded-full"></div>
          </div>

          {/* الوجه الخلفي */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl p-6 flex flex-col justify-center text-center shadow-lg bg-white border">
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors["muted-foreground"] }}
            >
              {getLocalizedText(feature.description, isArabic, "وصف")}
            </p>
            {feature.stats && (
              <div className="mt-4 pt-4 border-t">
                <div
                  className="text-2xl font-bold"
                  style={{ color: feature.color || colors.primary }}
                >
                  {feature.stats.value}
                </div>
                <div
                  className="text-xs"
                  style={{ color: colors["muted-foreground"] }}
                >
                  {getLocalizedText(feature.stats.label, isArabic, "تسمية")}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // شكل مينيمال
  const renderMinimalLayout = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {data.features.map((feature, index) => (
          <div key={feature.id} className="text-center group">
            {/* رقم */}
            <div className="text-6xl font-light mb-4 opacity-20 group-hover:opacity-40 transition-opacity">
              {(index + 1).toString().padStart(2, "0")}
            </div>

            {/* أيقونة بسيطة */}
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-full border-2 flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ borderColor: feature.color || colors.primary }}
            >
              {getFeatureIcon(feature.icon, feature.color || colors.primary)}
            </div>

            {/* العنوان */}
            <h3 className="text-lg font-semibold mb-3">
              {getLocalizedText(feature.title, isArabic, "عنوان")}
            </h3>

            {/* الوصف */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors["muted-foreground"] }}
            >
              {getLocalizedText(feature.description, isArabic, "وصف")}
            </p>

            {/* خط فاصل */}
            <div
              className="w-8 h-px mx-auto mt-4 transition-all duration-300 group-hover:w-16"
              style={{ backgroundColor: feature.color || colors.primary }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );

  // نمط الخلفية
  const renderBackgroundPattern = () => {
    if (!data.backgroundPattern || data.backgroundPattern === "none")
      return null;

    const patterns = {
      dots: (
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      ),
      lines: (
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(45deg, transparent 49%, ${colors.primary} 50%, transparent 51%)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      ),
      geometric: (
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `polygon(50% 0%, 0% 100%, 100% 100%)`,
              backgroundColor: colors.primary,
            }}
          ></div>
        </div>
      ),
    };

    return patterns[data.backgroundPattern];
  };

  if (!isVisible && !isPreview) return null;

  return (
    <section
      className={`relative py-20 overflow-hidden ${!isVisible ? "opacity-50" : ""}`}
      style={{
        backgroundColor: sectionSettings?.backgroundColor || colors.background,
        padding: sectionSettings?.padding,
        margin: sectionSettings?.margin,
        ...sectionSettings?.customStyles,
      }}
    >
      {/* نمط الخلفية */}
      {renderBackgroundPattern()}

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان والوصف */}
        {(data.title || data.subtitle || data.description) && (
          <div className="text-center mb-16">
            {data.title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.foreground }}
              >
                {getLocalizedText(data.title, isArabic, "ميزاتنا")}
              </h2>
            )}
            {data.subtitle && (
              <h3
                className="text-xl md:text-2xl mb-6"
                style={{ color: colors["muted-foreground"] }}
              >
                {getLocalizedText(data.subtitle, isArabic, "اكتشف ما يميزنا")}
              </h3>
            )}
            {data.description && (
              <p
                className="text-lg max-w-3xl mx-auto"
                style={{ color: colors["muted-foreground"] }}
              >
                {getLocalizedText(data.description, isArabic, "وصف")}
              </p>
            )}
          </div>
        )}

        {/* عرض المميزات حسب النمط المحدد */}
        <div className={data.animateOnScroll ? "animate-fade-in" : ""}>
          {featureStyle === "grid" && renderGridLayout()}
          {featureStyle === "carousel" && renderCarouselLayout()}
          {featureStyle === "timeline" && renderTimelineLayout()}
          {featureStyle === "comparison" && renderComparisonLayout()}
          {featureStyle === "hexagon" && renderHexagonLayout()}
          {featureStyle === "cards3d" && renderCards3DLayout()}
          {featureStyle === "minimal" && renderMinimalLayout()}
        </div>
      </div>

      {/* CSS للتأثيرات 3D */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .hover\\:rotate-y-180:hover {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
