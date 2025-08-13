"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import ModernHeroSection from "@/components/sections/ModernHeroSection";
import AdvancedStatsSection from "@/components/sections/AdvancedStatsSection";
import PremiumServicesSection from "@/components/sections/PremiumServicesSection";
import { createLoadingSkeleton } from "@/lib/component-utils";
import { usePerformanceMonitor } from "@/lib/performance";
import type { BaseComponent } from "@/lib/types";

const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

const AboutSection = dynamic(() => import("@/components/sections/AboutSection"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

const SectionSkeleton: React.FC = React.memo(() => (
  <div className="py-20 bg-gray-50" role="status" aria-label="Loading content">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <span className="sr-only">Loading section content...</span>
  </div>
));

SectionSkeleton.displayName = "SectionSkeleton";

const HomeClient: React.FC<BaseComponent> = () => {
  usePerformanceMonitor("HomePage");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ModernHeroSection />
        <AdvancedStatsSection />
        <PremiumServicesSection />

        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>

      <Suspense fallback={<div className="py-12 bg-gray-900 animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default React.memo(HomeClient);