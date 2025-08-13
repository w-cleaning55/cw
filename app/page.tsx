"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import { createLoadingSkeleton } from "@/lib/component-utils";
import { usePerformanceMonitor } from "@/lib/performance";
import { generateCleaningServiceStructuredData, generateFAQStructuredData, DEFAULT_SEO, generateMetaTags } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import type { BaseComponent } from "@/lib/types";

// Lazy load below-the-fold components for better performance
const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection"), {
  ssr: true,
  loading: () => createLoadingSkeleton("section"),
});

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

// Enhanced loading component with better UX
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

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" role="alert">
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">
        عذراً، حدث خطأ غير متوقع
      </h2>
      <p className="text-gray-600 mb-6" dir="rtl">
        نحن نعمل على حل هذه المشكلة. يرجى المحاولة مرة أخرى.
      </p>
      <button
        onClick={resetError}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="إعادة تحميل الصفحة"
      >
        إعادة المحاولة
      </button>
      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">Error details (dev only)</summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

// Main page component
const HomePage: React.FC<BaseComponent> = () => {
  // Performance monitoring in development
  usePerformanceMonitor("HomePage");

  const structuredData = React.useMemo(() => ({
    business: generateCleaningServiceStructuredData(),
    faq: generateFAQStructuredData(),
  }), []);

  const metaTags = React.useMemo(() => generateMetaTags(DEFAULT_SEO), []);

  return (
    <>
      <Head>
        <title>{DEFAULT_SEO.title}</title>
        {metaTags.map((tag, index) =>
          tag.property ? (
            <meta key={index} property={tag.property} content={tag.content} />
          ) : (
            <meta key={index} name={tag.name} content={tag.content} />
          )
        )}
        <link rel="canonical" href="https://m-clean.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.business),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.faq),
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content" tabIndex={-1}>
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
    </>
  );
};

// Export with performance optimizations
export default React.memo(HomePage);
