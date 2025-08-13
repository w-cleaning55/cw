"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";

// Lazy load below-the-fold components for better performance
const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection"), {
  ssr: true,
  loading: () => <div className="py-20 bg-gray-50 animate-pulse" />,
});

const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), {
  ssr: true,
  loading: () => <div className="py-20 bg-blue-50 animate-pulse" />,
});

const AboutSection = dynamic(() => import("@/components/sections/AboutSection"), {
  ssr: true,
  loading: () => <div className="py-20 bg-white animate-pulse" />,
});

const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), {
  ssr: true,
  loading: () => <div className="py-20 bg-gray-50 animate-pulse" />,
});

const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  ssr: true,
  loading: () => <div className="py-20 bg-blue-600 animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => <div className="py-12 bg-gray-900 animate-pulse" />,
});

// Loading component for better UX
const SectionSkeleton: React.FC = () => (
  <div className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>
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
}
