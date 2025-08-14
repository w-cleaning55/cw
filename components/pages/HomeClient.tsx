"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import StunningHeader from "@/components/layout/StunningHeader";
import BackgroundPatterns from "@/components/ui/BackgroundPatterns";
import { SmoothScrollProvider, ScrollProgress } from "@/components/ui/SmoothScrolling";
import { createLoadingSkeleton } from "@/lib/component-utils";
import { usePerformanceMonitor } from "@/lib/performance";
import type { BaseComponent } from "@/lib/types";

const StunningHeroSection = dynamic(() => import("@/components/sections/StunningHeroSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const StunningStatsSection = dynamic(() => import("@/components/sections/StunningStatsSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const PremiumServicesSection = dynamic(() => import("@/components/sections/PremiumServicesSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const AboutSection = dynamic(() => import("@/components/sections/AboutSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), { ssr: true, loading: () => createLoadingSkeleton("section") });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true, loading: () => createLoadingSkeleton("section") });

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
  const [content, setContent] = React.useState<any | null>(null);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/dynamic-content', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        setContent(data);
      } catch {
        setContent(null);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const order: string[] = content?.homepage?.order || ["hero","services","features","about","testimonials","contact"];
  const visible = (secId: string) => {
    const v = content?.homepage?.[secId]?.visible;
    return v === undefined ? true : !!v;
  };
  const heroVariant = content?.homepage?.hero?.component || 'modern';
  const servicesVariant = content?.homepage?.services?.component || 'premium';
  const getText = (obj?: { ar?: string; en?: string }) => obj?.ar || obj?.en || undefined;

  return (
    <SmoothScrollProvider>
      <BackgroundPatterns>
        <div className="min-h-screen">
          <ScrollProgress />
          <StunningHeader />
          <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<SectionSkeleton />}>
          {order.map((secId) => {
            if (!visible(secId)) return null;
            if (secId === 'hero') {
              return (
                <React.Fragment key="hero">
                  <StunningHeroSection />
                  <StunningStatsSection />
                </React.Fragment>
              );
            }
            if (secId === 'services') {
              return (
                <Suspense key="services" fallback={<SectionSkeleton />}>
                  {servicesVariant === 'premium' ? (
                    <PremiumServicesSection />
                  ) : (
                    <PremiumServicesSection />
                  )}
                </Suspense>
              );
            }
            if (secId === 'features') {
              return (
                <Suspense key="features" fallback={<SectionSkeleton />}>
                  <FeaturesSection
                    title={getText(content?.homepage?.features?.title)}
                    subtitle={getText(content?.homepage?.features?.subtitle)}
                    items={content?.homepage?.features?.items}
                  />
                </Suspense>
              );
            }
            if (secId === 'about') {
              return (
                <Suspense key="about" fallback={<SectionSkeleton />}>
                  <AboutSection
                    title={getText(content?.homepage?.about?.title)}
                    subtitle={getText(content?.homepage?.about?.subtitle)}
                    description={getText(content?.homepage?.about?.description)}
                    image={content?.homepage?.about?.image}
                  />
                </Suspense>
              );
            }
            if (secId === 'testimonials') {
              return (
                <Suspense key="testimonials" fallback={<SectionSkeleton />}>
                  <TestimonialsSection
                    title={getText(content?.homepage?.testimonials?.title)}
                    subtitle={getText(content?.homepage?.testimonials?.subtitle)}
                    items={content?.homepage?.testimonials?.items}
                  />
                </Suspense>
              );
            }
            if (secId === 'contact') {
              return (
                <Suspense key="contact" fallback={<SectionSkeleton />}>
                  <ContactSection
                    title={getText(content?.homepage?.contact?.title)}
                    subtitle={getText(content?.homepage?.contact?.subtitle)}
                    description={getText(content?.homepage?.contact?.description)}
                  />
                </Suspense>
              );
            }
            return null;
          })}
        </Suspense>
      </main>

          <Suspense fallback={<div className="py-12 bg-gray-900 animate-pulse" />}>
            <Footer />
          </Suspense>
        </div>
      </BackgroundPatterns>
    </SmoothScrollProvider>
  );
};

export default React.memo(HomeClient);
