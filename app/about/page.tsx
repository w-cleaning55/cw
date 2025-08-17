import React from "react";
import type { Metadata } from "next";
import AboutUsSection from "@/components/AboutUsSection";
import AdvancedStatsSection from "@/components/sections/AdvancedStatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import { SEO_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "من نحن - عالم النظافة جدة",
  description: "تعرف على شركة عالم النظافة جدة، شركة تنظيف محترفة تأسست عام 2018. نقدم خدمات تنظيف عالية الجودة بأحدث المعدات والتقنيات.",
  openGraph: {
    title: "من نحن - عالم النظافة جدة",
    description: "تعرف على شركة عالم النظافة جدة، شركة تنظيف محترفة تأسست عام 2018.",
    url: "https://www.cw.com.sa/about",
    type: "website",
  },
  alternates: {
    canonical: "https://www.cw.com.sa/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dir="rtl">
            من نحن
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed" dir="rtl">
            شركة عالم النظافة جدة - شريككم الموثوق لخدمات التنظيف المحترفة منذ عام 2018
          </p>
        </div>
      </section>

      {/* About Content */}
      <AboutUsSection />

      {/* Stats Section */}
      <AdvancedStatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Contact CTA */}
      <ContactSection />
    </div>
  );
}
